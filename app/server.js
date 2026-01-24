const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors'); // npm install cors

const app = express();
app.use(cors()); // Erlaubt deinem Frontend den Zugriff

app.get('/generate-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // Deine lokale URL
    await page.goto('http://localhost:5173/preview.html', { waitUntil: 'networkidle0' });

    /* @todo replace name, and add user uuid as subdir (e.g. /output/123e4567-e89b-12d3-a456-426614174000/file.pdf) */
    const outputPath = path.join(__dirname, 'output', 'dokumentation.pdf');
    await page.emulateMediaType('screen');

    await page.pdf({
      path: outputPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      displayHeaderFooter: false,
      margin: "4mm",
      preferCSSPageSize: true,

    });

    await browser.close();
    res.send({ status: 'success', message: 'PDF gespeichert in /app/output/' });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

app.listen(3000, () => console.log('PDF-Server läuft auf http://localhost:3000'));