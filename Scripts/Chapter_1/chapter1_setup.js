// Nastavení scén v Chapter 1 (včetně postav a pozadí)

function setupChapter1Scene(sceneName) {
  characters.length = 0;
  stopBackgroundEffect();

  switch (sceneName) {
    case "chapter1":
      base_image = CH1_BACKGROUNDS.window;
      characters.push(
        { ...CH1_CHARACTERS.maid,
          position: "center",
          currentEmotion: "scared"
        }
      );
      playBackgroundEffect("../Effects/Light.mp4");
      break;

       case "ch1_woke_up":
      base_image = CH1_BACKGROUNDS.window;
      characters.push(
        { ...CH1_CHARACTERS.maid,
          position: "center",
          currentEmotion: "scared"
        }
      );
      break;

       case "ch1_right_fingers":
      base_image = CH1_BACKGROUNDS.window;
      characters.push(
        { ...CH1_CHARACTERS.maid,
          position: "center",
          currentEmotion: "happy"
        }
      );
      break;

      case "ch1_bad_fingers":
      base_image = CH1_BACKGROUNDS.window;
      characters.push(
        { ...CH1_CHARACTERS.maid,
          position: "center",
          currentEmotion: "scared"
        }
      );
      break;


       case "ch1_play_dead":
      base_image = CH1_BACKGROUNDS.window;
      characters.push(
        { ...CH1_CHARACTERS.maid,
          position: "center",
          currentEmotion: "scared"
        }
      );
      break;

    case "ch1_joke_yes":
      base_image = CH1_BACKGROUNDS.outside;
      characters.push(
        { ...CH1_CHARACTERS.maid,
          position: "left",
          currentEmotion: "happy"
        },
        { ...CH1_CHARACTERS.doctor,
          position: "right",
          currentEmotion: "surprised"
        },
      );
      break;
      case "ch1_joke_no":
        base_image = CH1_BACKGROUNDS.outside;
        characters.push(
          { ...CH1_CHARACTERS.doctor,
            position: "left",
            currentEmotion: "happy"
          }
        );
        break;
        case "ch1_comeback":
        base_image = CH1_BACKGROUNDS.outside;
        characters.push(
          { ...CH1_CHARACTERS.doctor,
            position: "center",
            currentEmotion: "neutral"
          }
        );
        break;
    default:
      console.warn("Neznámá scéna:", sceneName);
  }

  resizeCanvas();     // Vykreslí BG
  drawCharacters();   // Vykreslí postavy
}
