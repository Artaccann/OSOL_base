console.log("Loader.js načten");

// Hlavní objekt Loaderu
const Loader = {
    scenes: {}, // Ukládá načtené scény

    // Načítá všechny scény
    loadScenes: function(sceneList) {
        let promises = sceneList.map(scene => Loader.loadScene(scene.name, scene.path));
        return Promise.all(promises);
    },

    // Funkce pro načtení Markdown souboru
    loadScene: function(name, path) {
        return fetch(path)
            .then(response => response.text()) // Načte textový obsah souboru
            .then(mdContent => {
                console.log(`📌 Načtený obsah souboru '${name}':\n`, mdContent); // Debug výpis
                Object.assign(Loader.scenes, Loader.parseMarkdown(mdContent)); // Uloží scénu
                console.log(`✅ Po parsování '${name}':`, Loader.scenes[name]); // Debug výpis
                console.log(`📌 Debug: Po zavolání loadScene('${name}')`, Loader.scenes); // Nový debug výpis
            })
            .catch(error => console.error(`❌ Chyba při načítání '${name}':`, error));
    },    
    
//PARSER na text a vyhodnocování chování postav na základě vztahů s nimi//
parseMarkdown: function(md) {
    let sections = {};
    let parts = md.split(/\n#\s*/);
  
    parts.forEach(part => {
      let lines = part.split("\n").map(line => line.trim()).filter(line => line);
      if (lines.length === 0) return;
  
      let sectionName = lines.shift().replace(/^#\s*/, "").trim().toLowerCase();
      let textLines = [];
      let choices = [];
  
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
  
        // === PODMÍNĚNÝ TEXT
        if (line.startsWith("{IF ") && !line.includes("](#")) {
          const conditionMatch = line.match(/^\{IF ([a-zA-Z0-9_]+)\s*([<>=!]+)\s*(-?\d+)\}\s*(.+)$/);
          if (conditionMatch) {
            const [, name, operator, value, restOfLine] = conditionMatch;
  
            textLines.push({
              type: "if",
              name: name.trim(),
              operator: operator.trim(),
              value: parseInt(value),
              text: restOfLine.trim()
            });
          }
          continue;
        }
  
        // === PODMÍNĚNÁ VOLBA
        if (line.startsWith("{IF ") && line.includes("](#")) {
          const choiceMatch = line.match(/^\{IF ([a-zA-Z0-9_]+)\s*([<>=!]+)\s*(-?\d+)\}\s*(\[[^\]]+\]\(#.+?\))/);
          if (choiceMatch) {
            const [, name, operator, value, choiceText] = choiceMatch;
  
            choices.push({
              type: "if",
              name: name.trim(),
              operator: operator.trim(),
              value: parseInt(value),
              choice: choiceText.trim()
            });
          }
          continue;
        }
  
        // === NORMÁLNÍ VOLBA
        const isChoice = line.match(/\[([^\]]+)\]\(#([^\)]+)\)/);
        if (isChoice) {
          choices.push(line);
          continue;
        }
  
        // === TEXT
        if (line.startsWith("<!--") && line.endsWith("-->")) {
            continue; // Přeskočí komentář
          }
          
        if (line !== "") {
          textLines.push(line);
        }
      }
  
      sections[sectionName] = {
        text: textLines,
        choices: choices
      };
    });
  
    return sections;
  }
     
};    
       

// 🚀 Načti všechny scény při startu
SoundManager.load("rain", "../Sounds/rain.mp3", true);
SoundManager.load("page", "../Sounds/page_flip.mp3");
SoundManager.load("thunder", "../Sounds/thunder_hit.mp3");
SoundManager.load("thunder", "../Sounds/bg_music.mp3");

window.addEventListener("load", function() {

        const cutsceneImages = [
        "../Sprites/ch1_sprites/ch1_cutscenes/cs_1.png",
        "../Sprites/ch1_sprites/ch1_cutscenes/cs_2.png",
        "../Sprites/ch1_sprites/ch1_cutscenes/cs_3.png",
        "../Sprites/ch1_sprites/ch1_cutscenes/cs_4.png"
    ];
    cutsceneImages.forEach(path => {
        const img = new Image();
        img.src = path;
    });

        const svgPaths = [
      "../Sprites/Default/UI/UI_choice.svg",
      "../Sprites/Default/UI/UI_dialogw_L.svg",
      "../Sprites/Default/UI/UI_dialogw_M.svg",
      "../Sprites/Default/UI/UI_dialogw_R.svg",
      "../Sprites/Default/UI/UI_heart.svg",
      "../Sprites/Default/UI/UI_heart_half_L.svg",
      "../Sprites/Default/UI/UI_heart_right_R.svg",
      "../Sprites/Default/UI/UI_back.svg",
      "../Sprites/Default/UI/UI_skip.svg"
    ];

    svgPaths.forEach(path => {
      const img = new Image();
      img.src = path;
    });


    Loader.loadScenes([
        { name: "chapter1", path: "../Chapters/chapter1.md" }
    ]).then(() => {
        console.log("✅ Všechny scény načteny:", Loader.scenes);
        //startGame(); // Teprve teď spustíme hru!
    }).catch(error => {
        console.error("❌ Chyba při načítání scén:", error);
    });
});

