// Postavy pro Chapter 1
const doctor_sheet = new Image();
doctor_sheet.src = '../Sprites/ch1_sprites/ch1_characters/doctor_sheet.png';

const maid_sheet = new Image();
maid_sheet.src = '../Sprites/ch1_sprites/ch1_characters/maid_sheet.png';

const advisor_sheet = new Image();
advisor_sheet.src = '../Sprites/ch1_sprites/ch1_characters/advisor_sheet.png';

const thorne_sheet = new Image();
thorne_sheet.src = '../Sprites/ch1_sprites/ch1_characters/thorne_sheet.png';

const laz_sheet = new Image();
laz_sheet.src = '../Sprites/ch1_sprites/ch1_characters/laz_sheet.png';


const CH1_CHARACTERS = {
  doctor: { 
    name: "doctor", 
    sheet: doctor_sheet,
    frameSize: { width: 700, height: 1080 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      happy:{ row: 0, col: 1 },
      angry: { row: 0, col: 2 },
      scared: { row: 0, col: 3 },
      sad: { row: 0, col: 4 },
    },
    currentEmotion: "neutral"
  },

  maid: { name: "maid", 
    sheet: maid_sheet,
    frameSize: { width: 700, height: 1080 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      happy:{ row: 0, col: 1 },
      angry: { row: 0, col: 2 },
      scared: { row: 0, col: 3 },
      sad: { row: 0, col: 4 },
    },
    currentEmotion: "neutral"
  },
  
  advisor: { name: "advisor", 
    sheet: advisor_sheet,
    frameSize: { width: 700, height: 1080 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      happy:{ row: 0, col: 1 },
      angry: { row: 0, col: 2 },
      scared: { row: 0, col: 3 },
      sad: { row: 0, col: 4 },
    },
    currentEmotion: "neutral"
  },

  thorne: { name: "thorne", 
    sheet: thorne_sheet,
    frameSize: { width: 700, height: 1080 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      happy:{ row: 0, col: 1 },
      angry: { row: 0, col: 2 },
      scaredd: { row: 0, col: 3 },
      sad: { row: 0, col: 4 },
    },
    currentEmotion: "neutral"
  },

  laz: { name: "laz", 
    sheet: laz_sheet,
    frameSize: { width: 700, height: 1080 }, // velikost jednoho výrazu
    expressions: {
      neutral: { row: 0, col: 0 },
      happy:{ row: 0, col: 1 },
      angry: { row: 0, col: 2 },
      scared: { row: 0, col: 3 },
      sad: { row: 0, col: 4 },
    },
    currentEmotion: "neutral"
  },
};
