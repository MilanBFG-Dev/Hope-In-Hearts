const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const infoDir = 'c:/Users/milan/Downloads/websiteinfo';

// Extract docx via zip
function extractDocx(filePath) {
  const JSZip = require('jszip');
  const data = fs.readFileSync(filePath);
  return JSZip.loadAsync(data).then((zip) => {
    return zip.file('word/document.xml').async('string');
  }).then((xml) => {
    return xml
      .replace(/<w:tab[^>]*\/>/g, '\t')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  });
}

async function main() {
  try {
    const docxText = await extractDocx(path.join(infoDir, 'Products.docx'));
    console.log('=== Products.docx ===');
    console.log(docxText);
  } catch (e) {
    console.error('docx error:', e.message);
  }

  // Try pdf-parse if available
  try {
    const pdfParseModule = require('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const pdfs = [
      'Crochet Bunnies.pdf',
      'Hair Brush and Comb.pdf',
      'Name Blocks description.pdf',
      'Name Blocks.pdf',
      'Wooden Letters.pdf',
    ];
    for (const pdf of pdfs) {
      const buf = fs.readFileSync(path.join(infoDir, pdf));
      const data = await pdfParse(buf);
      console.log('\n=== ' + pdf + ' ===');
      console.log(data.text);
    }
  } catch (e) {
    console.error('pdf error:', e.message, e.stack);
  }

  // Extract images from docx
  try {
    const JSZip = require('jszip');
    const data = fs.readFileSync(path.join(infoDir, 'Products.docx'));
    const zip = await JSZip.loadAsync(data);
    const mediaDir = path.join(infoDir, 'extracted-images');
    fs.mkdirSync(mediaDir, { recursive: true });
    for (const name of Object.keys(zip.files)) {
      if (name.startsWith('word/media/')) {
        const content = await zip.file(name).async('nodebuffer');
        const out = path.join(mediaDir, path.basename(name));
        fs.writeFileSync(out, content);
        console.log('Extracted image:', out);
      }
    }
  } catch (e) {
    console.error('image extract error:', e.message);
  }
}

main();
