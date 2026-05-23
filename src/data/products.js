export const PRODUCTS = [
  {
    id: 'blanket',
    name: 'Personalised Baby Blanket',
    price: 450,
    tagline: 'Snuggly & made with love',
    description:
      'A soft fleece blanket edged with satin ribbon, personalised with your little one’s name. Perfect for pram, cot, or gifting.',
    emoji: '🧸',
    colors: [
      { id: 'blush', name: 'Blush Pink', hex: '#F5D0D0' },
      { id: 'sky', name: 'Baby Blue', hex: '#C8DFF5' },
      { id: 'sage', name: 'Sage Green', hex: '#D4E4D4' },
      { id: 'cream', name: 'Warm Cream', hex: '#F5EDE0' },
    ],
    options: [
      {
        id: 'font',
        label: 'Name font',
        choices: ['Elegant Script', 'Playful Block', 'Classic Serif'],
      },
      {
        id: 'size',
        label: 'Size',
        choices: ['75 × 100 cm', '100 × 150 cm'],
      },
    ],
  },
  {
    id: 'name-sign',
    name: 'Nursery Name Sign',
    price: 320,
    tagline: 'Welcome baby home',
    description:
      'Hand-painted wooden sign for the nursery door or wall. Custom name, colour, and motif to match your theme.',
    emoji: '🌙',
    colors: [
      { id: 'blush', name: 'Blush Pink', hex: '#F5D0D0' },
      { id: 'lavender', name: 'Soft Lavender', hex: '#DDD0F0' },
      { id: 'mint', name: 'Mint', hex: '#D0EDE8' },
      { id: 'natural', name: 'Natural Wood', hex: '#E8DCC8' },
    ],
    options: [
      {
        id: 'motif',
        label: 'Motif',
        choices: ['Stars & Moon', 'Hearts', 'Floral', 'Minimal'],
      },
      {
        id: 'finish',
        label: 'Finish',
        choices: ['Matte painted', 'Gloss accent'],
      },
    ],
  },
  {
    id: 'memory-box',
    name: 'Baby Memory Box',
    price: 380,
    tagline: 'Treasure the tiny moments',
    description:
      'A keepsake box with hinged lid and velvet lining—ideal for first curl, hospital band, or special cards. Name engraved on the lid.',
    emoji: '💝',
    colors: [
      { id: 'blush', name: 'Blush Pink', hex: '#F5D0D0' },
      { id: 'sky', name: 'Baby Blue', hex: '#C8DFF5' },
      { id: 'white', name: 'Pure White', hex: '#FAFAFA' },
      { id: 'grey', name: 'Soft Grey', hex: '#E0E0E0' },
    ],
    options: [
      {
        id: 'lining',
        label: 'Lining',
        choices: ['Blush velvet', 'Ivory velvet', 'Grey velvet'],
      },
    ],
  },
  {
    id: 'booties',
    name: 'Handmade Crochet Booties',
    price: 195,
    tagline: 'Tiny toes, big warmth',
    description:
      'Soft cotton crochet booties with tie ribbon—0–6 months or 6–12 months. A sweet gift or shower favourite.',
    emoji: '👶',
    colors: [
      { id: 'blush', name: 'Blush Pink', hex: '#F5D0D0' },
      { id: 'sky', name: 'Baby Blue', hex: '#C8DFF5' },
      { id: 'butter', name: 'Butter Yellow', hex: '#F5EAC8' },
      { id: 'white', name: 'Snow White', hex: '#FAFAFA' },
    ],
    options: [
      {
        id: 'age',
        label: 'Size',
        choices: ['0–6 months', '6–12 months'],
      },
    ],
  },
];

/** Hope in Hearts — https://www.hopeinhearts.co.za/ */
export const BUSINESS = {
  name: 'Hope in Hearts Nursery Décor',
  website: 'https://www.hopeinhearts.co.za/',
  email: 'milangenade116@gmail.com',
  phone: '084 655 4902',
};

/** All orders are sent to this inbox */
export const ORDER_EMAIL = BUSINESS.email;
