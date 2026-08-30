import crochetBunnyWhite from '../Images/products/image1.png';
import crochetBunnyGrey from '../Images/products/image2.png';
import crochetBunnyStone from '../Images/products/image3.png';
import crochetBunnySize from '../Images/products/image4.png';
import crochetBunnyGroup from '../Images/products/image5.png';
import rattlePink from '../Images/products/image6.png';
import rattlePinkLife from '../Images/products/image7.png';
import rattleGreyLife from '../Images/products/image8.png';
import rattleGrey from '../Images/products/image9.png';
import brush from '../Images/products/image10.png';
import brushCombSet from '../Images/products/image11.png';
import comb from '../Images/products/image12.png';
import brushCombDims from '../Images/products/image13.png';
import nameBlocksLara from '../Images/products/image14.png';
import nameBlocksSage from '../Images/products/image15.png';
import nameBlocksFinn from '../Images/products/image16.png';
import nameBlocksSageLeaf from '../Images/products/image17.png';
import nameBlocksIsla from '../Images/products/image18.png';
import nameBlocksSofie from '../Images/products/image19.png';
import nameBlocksNealRattle from '../Images/products/image20.png';
import nameBlocksNealStar from '../Images/products/image21.png';
import woodenLettersBaby from '../Images/products/image22.png';
import woodenLettersSizes from '../Images/products/image23.png';
import woodenLettersAbcd from '../Images/products/image24.png';
import woodenLettersBabyNames from '../Images/products/image25.png';
import woodenLettersPatterns from '../Images/products/image26.png';

/** Hope in Hearts colour palette — from official colour chart */
export const COLOUR_PALETTE = [
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'stone', name: 'Stone', hex: '#E8DFD0' },
  { id: 'light-grey', name: 'Light Grey', hex: '#D4D4D4' },
  { id: 'dark-grey', name: 'Dark Grey', hex: '#6B6B6B' },
  { id: 'baby-pink', name: 'Baby Pink', hex: '#F8D0D8' },
  { id: 'dusty-pink', name: 'Dusty Pink', hex: '#D4A0A8' },
  { id: 'dark-pink', name: 'Dark Pink', hex: '#C8507A' },
  { id: 'baby-blue', name: 'Baby Blue', hex: '#B8D4F0' },
  { id: 'duck-egg-blue', name: 'Duck Egg Blue', hex: '#A8C8C8' },
  { id: 'dark-blue', name: 'Dark Blue', hex: '#3D5A7A' },
  { id: 'mint-green', name: 'Mint Green', hex: '#C8E8E0' },
  { id: 'sage-green', name: 'Sage Green', hex: '#9CB08C' },
  { id: 'lemon-yellow', name: 'Lemon Yellow', hex: '#F5E680' },
];

const ALL_COLOURS = COLOUR_PALETTE;

const CROCHET_BUNNY_COLOURS = COLOUR_PALETTE.slice(0, 3);
const RATTLE_COLOURS = [COLOUR_PALETTE[2], COLOUR_PALETTE[4]];

export const PRICE_PER_LETTER = 50;
export const COLLECT_LOCATION = 'Durbanville, Cape Town';

export function getProductLetterCount(product, personalisation = '') {
  if (!product?.pricePerLetter) return 0;
  return personalisation
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .length;
}

export function formatPrice(product, quantity = 1, letterCount = 0) {
  if (product.pricePerLetter) {
    const count = Math.max(letterCount, 1);
    return `R${product.pricePerLetter * count * quantity}`;
  }
  if (product.priceOnRequest) return 'Price on request';
  return `R${product.price * quantity}`;
}

export function formatProductListPrice(product) {
  if (product.pricePerLetter) return `R${product.pricePerLetter} per letter`;
  if (product.priceOnRequest) return 'Price on request';
  return `R${product.price}`;
}

export function getProductImageForColor(product, colorId) {
  if (!product) return null;
  if (colorId && product.colorImages?.[colorId]) return product.colorImages[colorId];
  return product.image;
}

export function getProductImageIndex(product, colorId) {
  const image = getProductImageForColor(product, colorId);
  const index = product.images?.indexOf(image);
  return index >= 0 ? index : 0;
}

export const PRODUCTS = [
  {
    id: 'name-blocks',
    name: 'Personalised Wooden Name Blocks',
    pricePerLetter: PRICE_PER_LETTER,
    tagline: 'Hand-painted keepsake blocks',
    description:
      'Create a beautiful, one-of-a-kind keepsake with our personalised wooden name blocks. Thoughtfully handcrafted and painted in your choice of soft, timeless colours — the perfect finishing touch for a nursery, child\'s bedroom, or playroom. Each block measures 6 × 6 cm. R50 per letter — each set is handmade to order.',
    image: nameBlocksLara,
    images: [
      nameBlocksLara,
      nameBlocksSage,
      nameBlocksFinn,
      nameBlocksSageLeaf,
      nameBlocksIsla,
      nameBlocksSofie,
      nameBlocksNealRattle,
      nameBlocksNealStar,
    ],
    colorImages: {
      white: nameBlocksLara,
      stone: nameBlocksNealStar,
      'light-grey': nameBlocksFinn,
      'dark-grey': nameBlocksSageLeaf,
      'baby-pink': nameBlocksIsla,
      'dusty-pink': nameBlocksLara,
      'dark-pink': nameBlocksIsla,
      'baby-blue': nameBlocksFinn,
      'duck-egg-blue': nameBlocksFinn,
      'dark-blue': nameBlocksNealStar,
      'mint-green': nameBlocksSage,
      'sage-green': nameBlocksSage,
      'lemon-yellow': nameBlocksSofie,
    },
    colors: ALL_COLOURS,
    showColourChart: true,
    options: [
      {
        id: 'lettering',
        label: 'Lettering style',
        choices: ['Vinyl', 'Natural wood'],
      },
    ],
    personalisationLabel: 'Name *',
    personalisationPlaceholder: 'e.g. Lara',
    personalisationRequired: true,
    perLetterColors: true,
    perLetterColorsIntro:
      'Each block is painted separately — pick a colour for every letter in the name.',
  },
  {
    id: 'wooden-letters',
    name: 'Personalised Wooden Name Letters',
    pricePerLetter: PRICE_PER_LETTER,
    tagline: 'Spell their name in style',
    description:
      'Create a space that\'s uniquely theirs with our handcrafted personalised wooden name letters. Perfect for spelling out your child\'s name above a bed, cot, or bedroom door. Each letter is individually painted in your choice of colours and designs. Available in Large (11 cm) or Small (7.5 cm). R50 per letter — each set is handmade to order.',
    image: woodenLettersBaby,
    images: [
      woodenLettersBaby,
      woodenLettersSizes,
      woodenLettersAbcd,
      woodenLettersBabyNames,
      woodenLettersPatterns,
    ],
    colorImages: {
      white: woodenLettersBaby,
      stone: woodenLettersBabyNames,
      'light-grey': woodenLettersBabyNames,
      'dark-grey': woodenLettersAbcd,
      'baby-pink': woodenLettersBaby,
      'dusty-pink': woodenLettersBaby,
      'dark-pink': woodenLettersPatterns,
      'baby-blue': woodenLettersAbcd,
      'duck-egg-blue': woodenLettersAbcd,
      'dark-blue': woodenLettersBabyNames,
      'mint-green': woodenLettersAbcd,
      'sage-green': woodenLettersAbcd,
      'lemon-yellow': woodenLettersBabyNames,
    },
    colors: ALL_COLOURS,
    showColourChart: true,
    options: [
      {
        id: 'size',
        label: 'Letter size',
        choices: ['Large (11 cm)', 'Small (7.5 cm)'],
      },
      {
        id: 'design',
        label: 'Design style',
        choices: ['Classic', 'Polka dot', 'Striped', 'Mixed (we\'ll confirm with you)'],
      },
    ],
    personalisationLabel: 'Name *',
    personalisationPlaceholder: 'e.g. Lara',
    personalisationRequired: true,
    perLetterColors: true,
    perLetterColorsIntro:
      'Each letter is painted separately — pick a colour for every letter in the name.',
  },
  {
    id: 'crochet-bunny',
    name: 'Handcrafted Crochet Bunny',
    price: 150,
    tagline: 'Soft cotton companion for little hands',
    description:
      'Our adorable handcrafted crochet bunny is the perfect companion for little ones. Lovingly made from soft cotton yarn, each bunny is designed for tiny hands to cuddle, play with, and treasure. Whether you\'re welcoming a new baby or looking for a thoughtful baby shower gift, this timeless bunny makes a beautiful keepsake. Approximately 23 cm / 9 in tall.',
    image: crochetBunnyWhite,
    images: [crochetBunnyWhite, crochetBunnyGrey, crochetBunnyStone, crochetBunnySize, crochetBunnyGroup],
    colorImages: {
      white: crochetBunnyWhite,
      stone: crochetBunnyStone,
      'light-grey': crochetBunnyGrey,
    },
    colors: CROCHET_BUNNY_COLOURS,
    showColourChart: true,
    options: [],
    personalisationLabel: 'Gift message (optional)',
    personalisationPlaceholder: 'e.g. With love, from Grandma',
  },
  {
    id: 'crochet-bunny-rattle',
    name: 'Crochet Bunny Rattle Teether',
    price: 95,
    tagline: 'Wooden ring rattle with soft bunny head',
    description:
      'A gentle wooden ring rattle with a soft crochet bunny head — perfect for newborn gifts, baby showers, and nursery décor. The natural wooden ring is ideal for teething, while the lovingly crocheted bunny adds a charming touch. Approximately 15 cm tall with a 6 cm ring.',
    image: rattleGreyLife,
    images: [rattleGreyLife, rattlePinkLife, rattleGrey, rattlePink],
    colorImages: {
      'light-grey': rattleGreyLife,
      'baby-pink': rattlePinkLife,
    },
    colors: RATTLE_COLOURS,
    showColourChart: true,
    options: [],
    personalisationLabel: 'Gift message (optional)',
    personalisationPlaceholder: 'e.g. Welcome little one',
  },
  {
    id: 'baby-hairbrush',
    name: 'Beech Wood Baby Hairbrush',
    price: 75,
    tagline: 'Ultra-soft goat hair bristles',
    description:
      'Care for your little one\'s delicate hair and scalp with our beech wood baby hairbrush. Made from natural beech wood with ultra-soft goat hair bristles that gently smooth fine baby hair while providing a soothing scalp massage. Suitable from birth. Approximately 15 cm long.',
    image: brush,
    images: [brush, brushCombSet, brushCombDims],
    colorImages: {
      natural: brush,
    },
    colors: [{ id: 'natural', name: 'Natural Beech Wood', hex: '#D4B896' }],
    showColourChart: false,
    options: [],
    personalisationLabel: 'Gift message (optional)',
    personalisationPlaceholder: 'Optional note',
  },
  {
    id: 'baby-comb',
    name: 'Beech Wood Baby Comb',
    price: 45,
    tagline: 'Gentle wide-tooth wooden comb',
    description:
      'A beautiful beech wood baby comb with wide, rounded teeth — gentle on delicate newborn skin and fine baby hair. Part of our timeless newborn essentials range. Approximately 14.5 cm long.',
    image: comb,
    images: [comb, brushCombSet, brushCombDims],
    colorImages: {
      natural: comb,
    },
    colors: [{ id: 'natural', name: 'Natural Beech Wood', hex: '#D4B896' }],
    showColourChart: false,
    options: [],
    personalisationLabel: 'Gift message (optional)',
    personalisationPlaceholder: 'Optional note',
  },
];

/** Hope in Hearts — https://www.hopeinhearts.co.za/ */
export const BUSINESS = {
  name: 'Hope in Hearts Nursery Décor',
  website: 'https://www.hopeinhearts.co.za/',
  email: 'hopeinheartsdecor@gmail.com',
  phone: '084 655 4902',
};

/** All orders are sent to this inbox */
export const ORDER_EMAIL = BUSINESS.email;
