console.log('OSOL');

const bgcanvas = document.getElementById('background-canvas');
const bgCtx = bgcanvas.getContext('2d');
const charcanvas = document.getElementById('character-canvas');
const charCtx = charcanvas.getContext('2d');

let base_image = CH1_BACKGROUNDS.room; // výchozí pozadí
const characters = []; // pole postav

function resizeCanvas() {
  bgcanvas.width = window.innerWidth;
  bgcanvas.height = window.innerHeight;
  charcanvas.width = window.innerWidth;
  charcanvas.height = window.innerHeight;

  drawBackground(base_image);
  drawCharacters();
}

window.addEventListener('resize', resizeCanvas);

//VZTAHOVÁ PORADNA//
const relationshipScores = {}; // např. { doctor: 1, maid: -1 }

function updateRelationship(tag) {
  const match = tag.match(/^([+-])([a-zA-Z0-9_]+)$/);
  if (!match) return;

  const [, operator, character] = match;
  if (!relationshipScores[character]) {
    relationshipScores[character] = 0;
  }

  if (operator === "+") {
    relationshipScores[character]++;
  } else if (operator === "-") {
    relationshipScores[character]--;
  }

  console.log(`💗 ${character} má nyní ${relationshipScores[character]} bodů.`);
  updateRelationshipDebug();

}

//!!!!!!!!DEBUG VZTAHŮ!!!!!!!//
function updateRelationshipDebug() {
  const container = document.getElementById("debug-relationships-content");
  container.innerHTML = "";

  for (const [char, score] of Object.entries(relationshipScores)) {
    const line = document.createElement("div");
    line.innerText = `${char}: ${score}`;
    container.appendChild(line);
  }
}


//VYKRESLOVÁNÍ POZADÍ//

function drawBackground(img) {
  const imgRatio = img.width / img.height;
  const canvasRatio = bgcanvas.width / bgcanvas.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    drawWidth = bgcanvas.height * imgRatio;
    drawHeight = bgcanvas.height;
    offsetX = (bgcanvas.width - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = bgcanvas.width;
    drawHeight = bgcanvas.width / imgRatio;
    offsetX = 0;
    offsetY = (bgcanvas.height - drawHeight) / 2;
  }

  bgCtx.clearRect(0, 0, bgcanvas.width, bgcanvas.height);
  bgCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

//VYKRESLOVÁNÍ POSTAV//

function drawCharacterSprite(char) {
  const sheet = char.sheet;
  const emotion = char.currentEmotion;
  const expression = char.expressions[emotion];
  const frameWidth = char.frameSize.width;
  const frameHeight = char.frameSize.height;

  if (!sheet.complete || !expression) return;

  const sx = expression.col * frameWidth;
  const sy = expression.row * frameHeight;

  const canvasWidth = charcanvas.width;
  const canvasHeight = charcanvas.height;

  const targetHeight = canvasHeight * 0.9;
  const targetWidth = (frameWidth / frameHeight) * targetHeight;

  let dx;
  switch (char.position) {
    case "left":
      dx = canvasWidth * 0.1;
      break;
    case "center":
      dx = (canvasWidth - targetWidth) / 2;
      break;
    case "right":
      dx = canvasWidth * 0.9 - targetWidth;
      break;
    default:
      dx = (canvasWidth - targetWidth) / 2;
  }

  const dy = canvasHeight - targetHeight - 20;

  charCtx.drawImage(
    sheet,
    sx, sy, frameWidth, frameHeight,
    dx, dy, targetWidth, targetHeight
  );
}


function drawCharacters() {
  charCtx.clearRect(0, 0, charcanvas.width, charcanvas.height);

  characters.forEach(char => {
    drawCharacterSprite(char);
  });
}


// Volání scény
function showScene(sceneName) {
  if (!Loader.scenes[sceneName]) {
    console.error(`❌ Chyba: Scéna '${sceneName}' neexistuje.`);
    return;
  }

  setupChapter1Scene(sceneName); // Použije kapitolu 1

  const scene = Loader.scenes[sceneName];
  let textLines = scene.text || [];

  const textContainer = document.getElementById("text-container");
  const choicesContainer = document.getElementById("choices-container");

  textContainer.innerHTML = "";
  choicesContainer.innerHTML = "";

  let index = 0;

  function showNextLine() {
    if (index < textLines.length) {
      const rawLine = textLines[index].trim();
      const parsed = parseDialogueLine(rawLine);
  
      textContainer.innerHTML = "";
      let p = document.createElement("p");
      textContainer.appendChild(p);
  
      if (parsed) {
        if (parsed.emotion) {
          changeCharacterEmotion(parsed.name, parsed.emotion);
        }
        typeWriterEffect(p, parsed.text, () => index++);
      } else {
        typeWriterEffect(p, rawLine, () => index++);
      }
    } else {
      showChoices(scene.choices || []);
      textContainer.removeEventListener("click", showNextLine);
    }
  }
  

  textContainer.addEventListener("click", showNextLine);
  showNextLine();
}

//TYPEWRITER//

function typeWriterEffect(element, text, callback) {
  let i = 0;
  element.innerHTML = "";
  const speed = 30;

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }

  type();
}

function showChoices(choices) {
  const container = document.getElementById("choices-container");
  container.innerHTML = "";

  choices.forEach(choice => {
    const linkMatch = choice.match(/\[([^\]]+)\]\(#([^\)]+)\)/);
    const scoreMatches = choice.match(/\{([+-][a-zA-Z0-9_]+)\}/g); // všechny tagy

    if (linkMatch) {
      const [_, text, target] = linkMatch;
      const btn = document.createElement("button");
      btn.innerText = text;

      btn.onclick = () => {
        if (scoreMatches) {
          scoreMatches.forEach(tag => {
            const cleanTag = tag.replace(/[{}]/g, ""); // odstraní složené závorky
            updateRelationship(cleanTag);
          });
        }
        showScene(target);
      };

      container.appendChild(btn);
    }
  });
}



//PARSERY//
function parseDialogueLine(line) {
  const fullMatch = line.match(/^([a-zA-Z0-9_ ]+)\s*\[([a-zA-Z0-9_]+)\]:\s*(.+)$/);
  if (fullMatch) {
    const [, name, emotion, text] = fullMatch;
    return {
      name: name.trim().toLowerCase(),
      emotion: emotion.trim().toLowerCase(),
      text: text.trim()
    };
  }

  const simpleMatch = line.match(/^([a-zA-Z0-9_ ]+):\s*(.+)$/);
  if (simpleMatch) {
    const [, name, text] = simpleMatch;
    return {
      name: name.trim().toLowerCase(),
      emotion: null,
      text: text.trim()
    };
  }

  return null;
}

function changeCharacterEmotion(name, emotion) {
  const char = characters.find(c => c.name.toLowerCase() === name.toLowerCase());

  if (!char) {
    console.warn(`❌ Postava '${name}' není aktivní ve scéně.`);
    return;
  }

  if (!char.expressions[emotion]) {
    console.warn(`❌ Výraz '${emotion}' neexistuje pro '${name}'`);
    return;
  }

  char.currentEmotion = emotion;
  drawCharacters();
}


// Start
function startGame() {
  console.log("🚀 Spouštím hru...");
  if (!Loader.scenes["chapter1"]) {
    console.warn("⏳ Čekám na načtení...");
    setTimeout(startGame, 500);
    return;
  }
  showScene("chapter1");
  updateRelationshipDebug();

}

window.onload = () => {
  startGame();
};
