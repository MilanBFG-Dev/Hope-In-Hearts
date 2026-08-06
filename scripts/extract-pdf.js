const fs = require('fs');
const path = require('path');

async function extractPdfText(filePath) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
  }
  return text;
}

async function main() {
  const infoDir = 'c:/Users/milan/Downloads/websiteinfo';
  const pdfs = [
    'Crochet Bunnies.pdf',
    'Hair Brush and Comb.pdf',
    'Name Blocks description.pdf',
    'Name Blocks.pdf',
    'Wooden Letters.pdf',
  ];
  for (const pdf of pdfs) {
    try {
      const text = await extractPdfText(path.join(infoDir, pdf));
      console.log('\n=== ' + pdf + ' ===');
      console.log(text.trim());
    } catch (e) {
      console.error(pdf, e.message);
    }
  }
}

main();
