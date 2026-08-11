export function parseNameLetters(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('');
}

export function syncLetterColors(letters, prevLetterColors = [], defaultColorId) {
  return letters.map((letter, index) => ({
    letter,
    colorId: prevLetterColors[index]?.colorId ?? defaultColorId,
  }));
}

export function resolveLetterColors(letterColors, palette) {
  return letterColors.map(({ letter, colorId }) => {
    const color = palette.find((c) => c.id === colorId) ?? palette[0];
    return {
      letter,
      colorId: color.id,
      colorName: color.name,
      colorHex: color.hex,
    };
  });
}

export function formatLetterColorsSummary(letterColors) {
  return letterColors.map(({ letter, colorName }) => `${letter}: ${colorName}`).join(' · ');
}

export function isDarkColor(hex) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
}
