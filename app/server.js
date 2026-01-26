const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/generate-pdf/:id', async (req, res) => {
  let browser;
  try {
    // Puppeteer für Docker optimieren
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || null, // Nutzt installiertes Chromium im Docker
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Verhindert Abstürze bei kleinem Docker-Speicher
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // WICHTIG: Nutze den Service-Namen 'frontend' statt 'localhost'
    // Und warte länger, falls das Frontend noch lädt
    const frontendUrl = `http://api:3030/api/cheatsheet/${req.params.id}/pdf`;
    console.log(`Navigiere zu: ${frontendUrl}`);

    await page.goto(frontendUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000 // 60s Timeout für langsame Render-Vorgänge
    });

    // Verzeichnis sicherstellen (Falls noch nicht existiert)
    const fs = require('fs');
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, req.params.id+'.pdf');

    await page.emulateMediaType('screen');
    try {
      // Warte bis das Element im DOM ist
      await page.waitForSelector('#render_wrapper', { timeout: 10000 });

      // Warte bis das Element nicht mehr leer ist
      await page.waitForFunction(
        () => document.querySelector('#render_wrapper').innerText.length > 0,
        { timeout: 10000 }
      );
    } catch (e) {
      console.warn("Inhalt wurde nicht rechtzeitig geladen - PDF könnte leer sein.");
    }

    await page.screenshot({ path: path.join(__dirname, 'output', 'debug_screenshot.png') });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      landscape: false, // Meistens Portrait für Dokumentationen
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      preferCSSPageSize: true,
    });

    await browser.close();
    res.send({ status: 'success', message: 'PDF erfolgreich generiert', path: '/output/'+req.params.id+'.pdf' });

  } catch (error) {
    if (browser) await browser.close();
    console.error("PDF Fehler:", error);
    res.status(500).send({ status: 'error', message: error.message });
  }
});

// Wichtig: Auf 0.0.0.0 hören für Docker!
app.listen(3000, '0.0.0.0', () => console.log('PDF-Server läuft auf Port 3000'));