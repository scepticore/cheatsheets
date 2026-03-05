import {HOST} from "../constants.js";
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export function generatePdf(pdf) {
  (async () => {
    // Browser starten
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Deine lokale URL aufrufen
    // 'networkidle0' wartet, bis keine Netzwerkaktivitäten mehr stattfinden (Bilder geladen)
    await page.goto(`${HOST}/preview.html`, {
      waitUntil: 'networkidle0',
    });

    // Pfad für die Ausgabe definieren
    const outputPath = path.join(__dirname, 'app', 'output', 'dokumentation.pdf');

    // PDF generieren mit deinen CSS-Print-Einstellungen
    await page.pdf({
      path: outputPath,
      format: 'A4',
      landscape: true,           // Querformat wie in deinem CSS @page
      printBackground: true,     // Wichtig für Hintergrundfarben (H1, H2 backgrounds)
      displayHeaderFooter: false,
      margin: {
        top: '5mm',
        bottom: '5mm',
        left: '5mm',
        right: '5mm'
      }
    });

    console.log(`PDF erfolgreich gespeichert unter: ${outputPath}`);

    await browser.close();
  })();
}
