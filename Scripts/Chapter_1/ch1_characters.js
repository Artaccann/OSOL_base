// Postavy pro Chapter 1
const doctor_sheet = new Image();
doctor_sheet.src = '../Sprites/doctor_sheet.png';

const maid_sheet = new Image();
maid_sheet.src = '../Sprites/maid_sheet.png';

const advisor_sheet = new Image();
advisor_sheet.src = '../Sprites/advisor_sheet.png';

const CH1_CHARACTERS = {
  doctor: { 
    name: "doctor", 
    sheet: doctor_sheet,
    frameSize: { width: 541.5, height: 1080 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      scared:{ row: 0, col: 1 },
      angry: { row: 0, col: 2 },
      happy: { row: 0, col: 3 },
    },
    currentEmotion: "neutral"
  },
  maid: { name: "maid", 
    sheet: maid_sheet,
    frameSize: { width: 512, height: 512 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      happy: { row: 0, col: 1 },
      angry: { row: 0, col: 2 }
    },
    currentEmotion: "neutral"
  },
  advisor: { name: "advisor", 
    sheet: maid_sheet,
    frameSize: { width: 512, height: 512 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      happy: { row: 0, col: 1 },
      angry: { row: 0, col: 2 }
    },
    currentEmotion: "neutral"
  },
};
