// 🔹 Cutscéna pro Chapter 1
const CH1_CUTSCENES = {
  intro: [
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_1.png",
      duration: 2000,
      transition: "fade-in",
      onStart: () => {
        SoundManager.play("page");
        SoundManager.play("rain");
      }
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_2.png",
      duration: 500,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_3.png",
      duration: 500,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_1.png",
      duration: 2000,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_2.png",
      duration: 500,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_3.png",
      duration: 500,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_1.png",
      duration: 2000,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_2.png",
      duration: 500,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_3.png",
      duration: 500,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_1.png",
      duration: 2000,
      onStart: () => SoundManager.play("page")
    },
    {
      image: "../Sprites/ch1_sprites/ch1_cutscenes/cs_4.png",
      duration: 200,
      onStart: () => SoundManager.play("thunder"),
      onEnd: () => {
        const canvas = document.getElementById("foreground-effect-canvas");
        const ctx = canvas.getContext("2d");

        canvasFlashTransition(ctx, () => {
          const firstLine = Loader.scenes["chapter1"]?.text?.[0] || "";
          document.getElementById("game-ui").style.display = "none";
          showScene("chapter1");

          if (!firstLine.startsWith("{NARRATE}")) {
            setTimeout(() => {
              document.getElementById("game-ui").style.display = "block";
            }, 500);
          }
        });
      }
    }
  ]
};

function canvasFlashTransition(ctx, callback) {
  let phase = "white";
  let alpha = 0;
  const maxAlpha = 1;
  const step = 0.1;

  function flashStep() {
    document.getElementById("game-ui").style.display = "none";

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (phase === "white") {
      ctx.fillStyle = "white";
      alpha += step;
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (alpha >= maxAlpha) {
        phase = "black";
        alpha = 0;
        setTimeout(flashStep, 50);
      } else {
        requestAnimationFrame(flashStep);
      }
    } else if (phase === "black") {
      ctx.fillStyle = "black";
      alpha += step;
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (alpha >= maxAlpha) {
        ctx.globalAlpha = 1;
        callback?.();
      } else {
        requestAnimationFrame(flashStep);
      }
    }
  }

  flashStep();
}


// 🔹 Funkce pro přehrání cutscény
function playCutscene(name) {
  document.getElementById("game-ui").style.display = "none";

  const sequence = CH1_CUTSCENES[name];
  if (!sequence || sequence.length === 0) {
    console.warn(`⚠️ Cutscéna '${name}' není definována.`);
    return;
  }

  const canvas = document.getElementById("foreground-effect-canvas");
  const ctx = canvas.getContext("2d");

  let index = 0;
  resizeCanvas();

  function drawFrame(step, callback) {
    const img = new Image();
    img.src = step.image;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (step.transition === "fade-in") {
        let alpha = 0;
        const fadeSteps = 30;
        const fadeStep = 1 / fadeSteps;
        const frameDelay = (step.duration || 2000) / fadeSteps;

        function stepFadeIn() {
          ctx.fillStyle = "#f1eae4";
          ctx.globalAlpha = 1;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.globalAlpha = alpha;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          alpha += fadeStep;

          if (alpha < 1) {
            setTimeout(stepFadeIn, frameDelay);
          } else {
            ctx.globalAlpha = 1;
            callback?.();
          }
        }

        stepFadeIn();
        return;
      }

      if (step.onStart) {
        try {
          step.onStart();
        } catch (err) {
          console.warn("⚠️ Chyba v onStart:", err);
        }
      }

      setTimeout(callback, step.duration || 2000);
    };

    img.onerror = () => {
      console.error("❌ Obrázek cutscény se nepodařilo načíst:", step.image);
      callback?.();
    };
  }

  function nextFrame() {
    if (index >= sequence.length) return;
    const step = sequence[index++];
    drawFrame(step, () => {
      if (step.onEnd) {
        step.onEnd();
      } else {
        nextFrame();
      }
    });
  }

  nextFrame();
}
