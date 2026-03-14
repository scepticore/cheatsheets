import {OUTPUT_DIR} from "../constants.js";
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
    renderButton.innerHTML = `<span class="loader" style="width: 16px; height: 16px; border-width: 2px; display: inline-block; margin-right: 8px;"></span> Generating PDF...`;

    const csID = renderButton.dataset.csid;

    try {
      const response = await cheatsheetsService.downloadPdf(csID);
      if (response && response.data && response.data.path) {
        const pdfPath = response.data.path;
      }
    } catch (error) {
      console.error(error);
    } finally {
      const downloadButton = document.createElement("a");
      downloadButton.classList.add("button", "success");
      downloadButton.style.marginLeft = "10px";
      downloadButton.target = "_blank";
      downloadButton.href = `${OUTPUT_DIR}${csID}.pdf`
      downloadButton.download = `${csID}.pdf`;
      downloadButton.innerHTML = `<i class="bi bi-download"></i> Download ready`;
      renderButton.parentNode.insertBefore(downloadButton, renderButton.nextSibling);

      renderButton.classList.remove("disabled");
      renderButton.disabled = false;
      renderButton.innerHTML = `<i class="bi bi-file-pdf"></i> Re-render PDF`;
    }
  });
}