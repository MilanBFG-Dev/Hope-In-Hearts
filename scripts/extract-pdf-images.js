const fs = require('fs');
const path = require('path');

async function extractPdfImages(pdfPath, outDir) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  fs.mkdirSync(outDir, { recursive: true });
  let count = 0;
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const ops = await page.getOperatorList();
    for (let j = 0; j < ops.fnArray.length; j++) {
      if (ops.fnArray[j] === pdfjs.OPS.paintImageXObject) {
        const imgName = ops.argsArray[j][0];
        try {
          const img = await page.objs.get(imgName);
          if (img && img.data) {
            const { PNG } = require('pngjs');
            const png = new PNG({ width: img.width, height: img.height });
            png.data = Buffer.from(img.data);
            const out = path.join(outDir, `page${i}-img${count++}.png`);
            fs.writeFileSync(out, PNG.sync.write(png));
            console.log('Saved', out);
          }
        } catch (e) {
          // skip
        }
      }
    }
  }
}

async function main() {
  const infoDir = 'c:/Users/milan/Downloads/websiteinfo';
  for (const pdf of ['Name Blocks.pdf', 'Wooden Letters.pdf']) {
    try {
      await extractPdfImages(path.join(infoDir, pdf), path.join(infoDir, 'pdf-images', pdf.replace('.pdf', '')));
    } catch (e) {
      console.error(pdf, e.message);
    }
  }
}

main();
