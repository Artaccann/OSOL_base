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

    parseMarkdown: function(md) {
        let sections = {};
        let parts = md.split(/\n\#\s*/); // Rozdělení podle `#`
    
        parts.forEach(part => {
            let lines = part.split("\n").map(line => line.trim()).filter(line => line);
            if (lines.length === 0) return; // Přeskakuje prázdné sekce
    
            let sectionName = lines.shift().replace(/^#\s*/, "").trim().toLowerCase();
            console.log(`📌 Načítám sekci: '${sectionName}'`); // Debug sekce
    
            let textLines = [];
            let choices = [];
    
            lines.forEach(line => {
                if (line.startsWith("[")) {
                    choices.push(line);
                } else if (!line.startsWith("SceneSetup") && line !== "") {
                    textLines.push(line);
                }
            });
    
            console.log(`✅ Ukládám text pro '${sectionName}':`, textLines); // Debug textu
            sections[sectionName] = {
                text: textLines,
                choices: choices
            };
        });
    
        console.log("📌 Všechny sekce po parsování:", sections);
        return sections;
    }
    
};    
       

// 🚀 Načti všechny scény při startu
window.addEventListener("load", function() {
    Loader.loadScenes([
        { name: "chapter1", path: "../Chapters/chapter1.md" }
    ]).then(() => {
        console.log("✅ Všechny scény načteny:", Loader.scenes);
        startGame(); // Teprve teď spustíme hru!
    }).catch(error => {
        console.error("❌ Chyba při načítání scén:", error);
    });
});

