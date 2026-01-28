import {cheatsheetsService} from "../services/cheatsheetsService";
import { marked } from "marked";

export async function showPreview(id) {
  try {
    const previewTemplate = await fetch("/preview.html");
    const templateString = await previewTemplate.text();

    // Daten holen
    const data = await cheatsheetsService.getCheatsheetMarkdown(id);

    // Wichtig: Da deine API { cheatsheet, markdown } liefert,
    // und markdown wiederum { body } enthält:
    const rawMarkdown = data?.body || "";

    // HTML-Struktur setzen
    document.documentElement.innerHTML = templateString;

    const renderWrapper = document.getElementById("render_wrapper");
    if (renderWrapper) {
      const fullHtml = marked.parse(rawMarkdown);
      renderWrapper.innerHTML = paginateMarkdown(fullHtml);
    }
  } catch (error) {
    console.error("Fehler in showPreview:", error);
  }
}

// function paginateMarkdown(htmlString) {
//   const sections = htmlString.split(/(?=<h1>)/g);
//   const paginated = sections.map(section => {
//       if (section.trim() === "") return "";
//       return `<div class="page">${section}</div>`;
//     })
//     .join("");
//
//   return paginated;
// }