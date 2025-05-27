console.log('OSOL');
// localStorage.removeItem("osol-save"); <- budu eventually potřebovat na čistku localstorage

const narrationBG = new Image();
narrationBG.src = "../Sprites/ch1_sprites/ch1_backgrounds/black.png";

let gameStarted = false;
let shouldLoad = false;

let index = 0;
let textLines = [];

let currentScene = "";

let isNarrating = false; // přidej globálně


document.getElementById("prev-line").addEventListener("click", () => {
  if (index > 1) {
    index -= 2; // protože showNextLine inkrementuje
    showNextLine();
  }
});

document.getElementById("skip-to-choice").addEventListener("click", () => {
  index = textLines.length;
  showNextLine();
});


const bgcanvas = document.getElementById('background-canvas');
const bgCtx = bgcanvas.getContext('2d');
const charcanvas = document.getElementById('character-canvas');
const charCtx = charcanvas.getContext('2d');
const bgeffcanvas = document.getElementById('background-effect-canvas');
const bgeffCtx = bgeffcanvas.getContext('2d');
const fgeffcanvas = document.getElementById('foreground-effect-canvas');
const fgeffCtx = fgeffcanvas.getContext('2d');

const bgEffectVideo = document.createElement('video');

bgEffectVideo.src = "../Effects/Light.mp4"; // nebo jiný efekt
bgEffectVideo.loop = true;
bgEffectVideo.muted = true;
bgEffectVideo.autoplay = true;
bgEffectVideo.playsInline = true;
bgEffectVideo.crossOrigin = "anonymous"; // když hostuješ externě

let base_image = CH1_BACKGROUNDS.room; // výchozí pozadí
const characters = []; // pole postav



function resizeCanvas() {
  bgcanvas.width = window.innerWidth;
  bgcanvas.height = window.innerHeight;
  charcanvas.width = window.innerWidth;
  charcanvas.height = window.innerHeight;
  bgeffcanvas.width = window.innerWidth;
  bgeffcanvas.height = window.innerHeight;
  fgeffcanvas.width = window.innerWidth;
  fgeffcanvas.height = window.innerHeight;

  // ⚠️ Bezpečně volíme drawBackground
  if (
    base_image instanceof HTMLImageElement &&
    base_image.complete &&
    base_image.naturalWidth > 0
  ) {
    drawBackground(base_image);
  }

  drawCharacters();
  drawBackgroundEffect();
  drawForegroundEffect();
}


window.addEventListener('resize', resizeCanvas);

//UKLÁDÁNÍ//

// ⬇️ Načtení uložené pozice
function loadGameProgress() {
  const raw = localStorage.getItem("osol-save");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("❌ Chyba při čtení uložené pozice:", e);
    return null;
  }
}

// ⬇️ Ukládání pozice hry
function saveGameProgress(sceneName, index) {
  const state = {
    scene: sceneName,
    index: index
  };
  
  
  localStorage.setItem("osol-save", JSON.stringify(state));
}

function switchToChat() {
  const saveData = {
    scene: currentScene,
    index: index,
    relationshipScores: relationshipScores
  };
  localStorage.setItem("osol-chat-transfer", JSON.stringify(saveData));
  window.location.href = "Chat.html";
}



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

function getRelationshipMood(score) {
  if (score >= 3) return "❤️ Má tě fakt rád";
  if (score === 2) return "😊 Má tě rád";
  if (score === 1) return "🙂 Má tě trochu rád";
  if (score === 0) return "😐 Neutrální";
  if (score === -1 || score === -2) return "😠 Nemá tě rád";
  if (score <= -3) return "💀 Nenávidí tě";
}


//!!!!!!!!DEBUG VZTAHŮ!!!!!!!//
function updateRelationshipDebug() {
  const container = document.getElementById("debug-relationships-content");
  container.innerHTML = "";

  for (const [char, score] of Object.entries(relationshipScores)) {
    const line = document.createElement("div");
    const mood = getRelationshipMood(score);
    line.innerText = `${char}: ${score} → ${mood}`;
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
//VYKRESLOVÁNÍ EFEKTŮ NA POZADÍ//

function drawBackgroundEffect() {
  if (bgEffectVideo.readyState >= 2) {
    bgeffCtx.clearRect(0, 0, bgeffcanvas.width, bgeffcanvas.height);

    // 💡 Nastavení blend módu a průhlednosti
    bgeffCtx.globalCompositeOperation = "lighter"; // nebo "soft-light", "screen", atd.
    bgeffCtx.globalAlpha = 0.6; // průhlednost efektu

    bgeffCtx.drawImage(bgEffectVideo, 0, 0, bgeffcanvas.width, bgeffcanvas.height);

    // 💡 Reset zpět na výchozí, aby neovlivnil další kreslení
    bgeffCtx.globalCompositeOperation = "source-over";
    bgeffCtx.globalAlpha = 1.0;
  }

  requestAnimationFrame(drawBackgroundEffect);
}



function playBackgroundEffect(path) {
  bgEffectVideo.src = path;
  bgEffectVideo.play().catch(err => console.warn("⚠️ Nelze přehrát video:", err));
}

function stopBackgroundEffect() {
  bgEffectVideo.pause();
  bgEffectVideo.src = ""; // tím se odstraní obsah efektů na scénách kde nejsou definovány
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
//VYKRESLOVÁNÍ EFEKTŮ V POPŘEDÍ//
function drawForegroundEffect() {
  fgeffCtx.clearRect(0, 0, fgeffcanvas.width, fgeffcanvas.height);
  // Pokud budeš chtít efekty nad postavami, sem později přidáš jejich kreslení.
}

// SRDCE //
function triggerHeartBreak() {
  const heart = document.getElementById('heart-crack-container');
  if (!heart) return;

  heart.style.display = 'block';

  heart.innerHTML = `
    <img src="../Sprites/Default/UI/UI_heart_half_L.svg" class="heart-part left-part" />
    <img src="../Sprites/Default/UI/UI_heart_right_R.svg" class="heart-part right-part" />
  `;

  const left = heart.querySelector('.left-part');
  const right = heart.querySelector('.right-part');

  // Fade-in efekt
  [left, right].forEach(el => {
    el.style.opacity = "1";
  });

  // Rozpad se zpožděním pro efekt
  setTimeout(() => {
    left.classList.add('crack');
    right.classList.add('crack');
  }, 350); // pauza nebo ne před rozapdem srdce


  // Skryj kontejner po animaci
  setTimeout(() => {
    heart.style.display = 'none';
  }, 2500);
}

function triggerHeartLove() {
  console.log("💖 Spouštím triggerHeartLove");

  const heart = document.getElementById('heart-pulsing-container');
  if (!heart) return;

  const img = heart.querySelector('img');
  if (!img) return;

  // Reset animací
  img.classList.remove('heart-full');
  void img.offsetWidth; // force reflow

  heart.style.display = 'block';
  img.classList.add('heart-full');

  // Skryj až po celé animaci (0.3 + 0.9 + 0.3 = 1.5s)
  setTimeout(() => {
    heart.style.display = 'none';
  }, 1500);
}






// Volání scény
function showScene(sceneName) {
  if (!Loader.scenes[sceneName]) {
    console.error(`❌ Chyba: Scéna '${sceneName}' neexistuje.`);
    return;
  }

  setupChapter1Scene(sceneName);
  const scene = Loader.scenes[sceneName];
  textLines = scene.text || [];
  if (!shouldLoad) index = 0;

 

  // 🔴 DETEKUJEME PRVNÍ NARRATE
  const isNarrationScene = textLines[0]?.startsWith?.("{NARRATE}");

  // 🔧 Vypneme UI ještě před renderem
  const gameUI = document.getElementById("game-ui");
    if (isNarrationScene) {
    gameUI.style.display = "none"; // 🔇 Skryjeme celé UI
  } else {
    gameUI.style.display = "block"; // ✅ Jinak zapneme normálně
  }


  const textContainer = document.getElementById("text-container");
  const choicesContainer = document.getElementById("choices-container");

  textContainer.innerHTML = "";
  choicesContainer.innerHTML = "";

   showNextLine();

  // ************ VYKRESLOVÁNÍ TEXTU  ************ ///

 function showNextLine() {
  choicesContainer.innerHTML = "";
  console.log(`🔁 Index: ${index} / ${textLines.length}`);

  if (index >= textLines.length) {
    console.log("🎉 Konec textu, zobrazím volby");
    showChoices(scene.choices || []);
    textContainer.removeEventListener("click", showNextLine);
    return;
  }

  const rawLine = textLines[index];

  // === 1. NARRATE
 if (typeof rawLine === "string" && rawLine.startsWith("{NARRATE}")) {
  const dialogWindow = document.querySelector(".dialog-window");
  if (dialogWindow) dialogWindow.style.display = "none";

  // 🧼 Schováme plátna s postavami i pozadím
  document.getElementById("character-canvas").style.display = "none";
  document.getElementById("background-canvas").style.display = "none";
  document.getElementById("background-effect-canvas").style.display = "none";

  const text = rawLine.replace("{NARRATE}", "").trim();
  index++;
  showNarrationOnCanvas(text, () => {
    const nextLine = textLines[index];
    
    // 🧼 Po naraci UI vracíme jen pokud další replika není další narace
    if (nextLine && !nextLine.startsWith("{NARRATE}")) {
      document.getElementById("character-canvas").style.display = "block";
      document.getElementById("background-canvas").style.display = "block";
      document.getElementById("background-effect-canvas").style.display = "block";
      document.getElementById("game-ui").style.display = "block";
    }

    showNextLine();
  });
  return;
}


  // === 2. Normální textová replika
  if (typeof rawLine === "string") {
    const parsed = parseDialogueLine(rawLine);

    // 💬 DETEKUJEME LAZIEL CHAT
    if (parsed?.name === "laziel" && parsed.text.toLowerCase().includes("talk to me")) {
      switchToChat();
      return;
    }

    const dialogWindow = document.querySelector(".dialog-window");
    dialogWindow.style.display = "flex";
    dialogWindow.removeEventListener("click", showNextLine);
    dialogWindow.addEventListener("click", showNextLine);

    if (parsed) {
      const char = characters.find(c => c.name === parsed.name);
      const position = char?.position || "center";

      dialogWindow.classList.remove("w-left", "w-middle", "w-right");
      dialogWindow.classList.add(`w-${position}`);

      const dialogImg = dialogWindow.querySelector(".dialog-svg");
      if (dialogImg) {
        const pathMap = {
          left: "../Sprites/Default/UI/UI_dialogw_L.svg",
          center: "../Sprites/Default/UI/UI_dialogw_M.svg",
          right: "../Sprites/Default/UI/UI_dialogw_R.svg",
        };
        dialogImg.src = pathMap[position];
      }

      if (parsed.emotion) {
        changeCharacterEmotion(parsed.name, parsed.emotion);
      }
    }

    const textContainer = document.getElementById("text-container");
    textContainer.innerHTML = "";
    let p = document.createElement("p");
    textContainer.appendChild(p);

    typeWriterEffect(p, parsed ? parsed.text : rawLine, () => {
      saveGameProgress(sceneName, index);
      index++;
    });

    return;
  }

  // === 3. Podmínka typu {IF ...}
  if (typeof rawLine === "object" && rawLine.type === "if") {
    const { name, operator, value, text } = rawLine;
    const score = relationshipScores[name] ?? 0;

    const pass = {
      "==": score === value,
      "!=": score !== value,
      ">=": score >= value,
      "<=": score <= value,
      ">":  score > value,
      "<":  score < value
    }[operator];

    console.log(`🎯 Vyhodnocuju: ${name} ${operator} ${value} → ${score} = ${pass}`);

    if (pass) {
      const parsed = parseDialogueLine(text);

      const dialogWindow = document.querySelector(".dialog-window");
      dialogWindow.style.display = "flex";
      dialogWindow.removeEventListener("click", showNextLine);
      dialogWindow.addEventListener("click", showNextLine);

      if (parsed) {
        const char = characters.find(c => c.name === parsed.name);
        const position = char?.position || "middle";
        dialogWindow.className = `dialog-window w-${position}`;

        if (parsed.emotion) {
          changeCharacterEmotion(parsed.name, parsed.emotion);
        }
      }

      const textContainer = document.getElementById("text-container");
      textContainer.innerHTML = "";
      let p = document.createElement("p");
      textContainer.appendChild(p);

      typeWriterEffect(p, parsed ? parsed.text : text, () => {
        saveGameProgress(sceneName, index);
        index++;
      });
    } else {
      index++;
      saveGameProgress(sceneName, index);
      showNextLine();
    }
  }
}
}






// ************ TYPEWRITER ************* //

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

function showNarrationOnCanvas(text, onDone) {
  const canvas = document.getElementById("foreground-effect-canvas");
  const ctx = canvas.getContext("2d");

  const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--text-font").trim();
  ctx.font = `32px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";

  // počkej, než je obrázek připravený (jen poprvé)
  if (!narrationBG.complete) {
    narrationBG.onload = () => startTyping();
  } else {
    startTyping();
  }

  function startTyping() {
    let i = 0;
    let displayText = "";

    function drawTyping() {
      displayText += text.charAt(i);
      i++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(narrationBG, 0, 0, canvas.width, canvas.height); // 🔁 z cache!
      wrapText(ctx, displayText, canvas.width / 2, canvas.height / 2, 800, 40);

      if (i < text.length) {
        setTimeout(drawTyping, 30);
      } else {
        canvas.addEventListener("click", finish, { once: true });
      }
    }

    function finish() {
      document.getElementById("character-canvas").style.display = "block";
      document.getElementById("background-canvas").style.display = "block";
      document.getElementById("background-effect-canvas").style.display = "block";
      document.querySelector(".dialog-window").style.display = "flex";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onDone?.();
    }

    drawTyping();
  }
}


function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
}


function showNarration(text) {
  const dialogWindow = document.querySelector(".dialog-window");
  dialogWindow.style.display = "none"; // skryj dialogové okno

  const charCanvas = document.getElementById("character-canvas");
  if (charCanvas) charCanvas.style.display = "none"; // skryj postavy

  const existing = document.getElementById("narration-overlay");
  if (existing) existing.remove(); // kdyby zůstalo

  const narration = document.createElement("div");
  narration.id = "narration-overlay";
  narration.classList.add("narration-text");

  // Přidáme pozadí
  narration.style.background = "rgba(0,0,0,0.8)";
  narration.style.padding = "2em";
  narration.style.borderRadius = "10px";

  document.body.appendChild(narration);

  narration.onclick = () => {
    if (narrationClicked) return;
    narrationClicked = true;
    narration.remove();
    dialogWindow.style.display = "flex";
    if (charCanvas) charCanvas.style.display = "block";
    showNextLine();
  };

  let narrationClicked = false;
  typeWriterEffect(narration, text);
}



// ****************** VOLBY **************** //




function showChoices(choices) {
  const container = document.getElementById("choices-container");
  container.innerHTML = "";

  console.log("👀 Spouštím showChoices");
  console.log("✏️ Raw choices:", choices);

  // 💬 Skryj dialogové okno
  document.querySelector(".dialog-window").style.display = "none";

  choices.forEach(choice => {
    // === 1. Podmíněná volba s {IF ...}
    const conditionMatch = choice.match(/^\{IF ([a-zA-Z0-9_]+)\s*([<>=!]+)\s*(-?\d+)\}\s*(\[.*?\]\(#.*?\))(?:\s*\{([+-][a-zA-Z0-9_]+)\})?/);
    if (conditionMatch) {
      const [, name, operator, value, rawLink, relationshipTag] = conditionMatch;
      const score = relationshipScores[name] ?? 0;
      const num = parseInt(value);

      const pass = {
        "==": score === num,
        "!=": score !== num,
        ">=": score >= num,
        "<=": score <= num,
        ">":  score > num,
        "<":  score < num
      }[operator];

      if (!pass) return;

      const match = rawLink.match(/\[([^\]]+)\]\(#([^\)]+)\)/);
      if (!match) return;

      const [_, text, target] = match;

      createChoiceButton(text, target, relationshipTag, container);
      return;
    }

    // === 2. Normální volba s tagy (např. [Yes!](#target) {+doctor})
    const choiceOnly = choice.replace(/\{[+-][a-zA-Z0-9_]+\}/g, "").trim(); // odstraníme tagy pro match
    const linkMatch = choiceOnly.match(/\[([^\]]+)\]\(#([^\)]+)\)/);
    const scoreMatches = choice.match(/\{([+-][a-zA-Z0-9_]+)\}/g); // vztahové tagy

    if (linkMatch) {
      const [_, text, target] = linkMatch;
      createChoiceButton(text, target, scoreMatches, container);
    }
  });

  if (container.children.length === 0) {
    console.warn("⚠️ Žádná volba se nevytvořila!");
  }
}

function createChoiceButton(text, target, relationshipTags, container) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("choice-button-wrapper");

  const svg = document.createElement("img");
  svg.classList.add("choice-button-svg");
  svg.src = "../Sprites/Default/UI/UI_choice.svg"; // uprav podle potřeby

  const btn = document.createElement("button");
  btn.classList.add("choice-button-text");
  btn.innerText = text;

  btn.onclick = () => {
    document.querySelector(".dialog-window").style.display = "flex";

 if (Array.isArray(relationshipTags)) {
  relationshipTags.forEach(tag => {
    const cleanTag = tag.replace(/[{}]/g, "");
    updateRelationship(cleanTag);
    if (cleanTag.startsWith("-")) triggerHeartBreak();
    if (cleanTag.startsWith("+")) triggerHeartLove();
  });
  } else if (typeof relationshipTags === "string") {
    updateRelationship(relationshipTags);
    if (relationshipTags.startsWith("-")) triggerHeartBreak();
    if (relationshipTags.startsWith("+")) {
    console.log("💘 Pozitivní vztah → spouštím triggerHeartLove");
    triggerHeartLove();}
  }





    showScene(target);
  };

  wrapper.appendChild(svg);
  wrapper.appendChild(btn);
  container.appendChild(wrapper);

  console.log("✅ Choice button created:", text);
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

const menu = document.getElementById("side-menu");
const toggle = document.getElementById("toggle-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("menu-expanded");
});



// Start
function startGame() {
  if (gameStarted) return;
  if (!Loader.scenes["chapter1"]) {
    console.warn("⏳ Čekám na načtení...");
    setTimeout(startGame, 500);
    return;
  }

  console.log("🚀 Spouštím hru...");
  gameStarted = true;

  shouldLoad = localStorage.getItem("loadFromSave") === "true";  // ⬅️ upraveno
  localStorage.removeItem("loadFromSave");

  const save = loadGameProgress();
  if (shouldLoad && save && Loader.scenes[save.scene]) {
    index = save.index || 0;
    showScene(save.scene);
  } else {
    showScene("chapter1");
  }

  updateRelationshipDebug();
}

window.addEventListener("DOMContentLoaded", () => {
  SoundManager.loadDefaults();

  function waitForScenesAndStart() {
  if (!Loader.scenes["chapter1"]) {
    console.warn("⏳ Čekám na načtení scén...");
    setTimeout(waitForScenesAndStart, 200);
    return;
  }

  console.log("✅ Všechny scény načteny:", Loader.scenes);

  const saved = JSON.parse(localStorage.getItem("osol-chat-transfer") || "null"); // ← ZMĚNA

  if (saved) {
    console.log("🔁 Návrat z chatu!");
    currentScene = saved.scene || "chapter1";
    index = saved.index || 0;
    Object.assign(relationshipScores, saved.relationshipScores || {});
    updateRelationshipDebug();
    showScene(currentScene);
    localStorage.removeItem("osol-chat-transfer"); // ← ZMĚNA
  } else {
    const shouldStartWithCutscene = localStorage.getItem("startWithCutscene") === "true";
    localStorage.removeItem("startWithCutscene");

    if (shouldStartWithCutscene) {
      playCutscene("intro");
    } else {
      startGame();
    }
  }
}

  waitForScenesAndStart();
});





