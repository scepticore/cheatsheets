import {HOST} from "../constants.js";
import {cheatsheetsService} from "../services/cheatsheetsService.js";

export function downloadPdf() {
  const renderButton = document.getElementById("downloadPdf");
  if (!renderButton) return;

  renderButton.addEventListener("click", async (event) => {
    // Call pdf-generator service
    event.preventDefault();
    event.stopPropagation();
    if (renderButton.disabled) return;

    renderButton.classList.add("disabled");
    renderButton.disabled = true;
    renderButton.innerHTML = "Generating PDF...";

    const csID = renderButton.dataset.csid;

    try {
      const response = await cheatsheetsService.downloadPdf(csID);
      if (response && response.data && response.data.path) {
        const pdfPath = response.data.path;
        const link = document.createElement("a");
        link.href = `${HOST}/${pdfPath}`;
        console.log(link.href);
        // link.setAttribute('download', `cheatsheet_${csID}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error(error);
    } finally {
      renderButton.classList.remove("disabled");
      renderButton.disabled = false;
      renderButton.innerHTML = `<i class="bi bi-file-pdf"></i>Download PDF`;
    }
  });
}