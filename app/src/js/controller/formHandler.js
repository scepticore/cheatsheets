import {cheatsheetsService as cheatsheetService} from "../services/cheatsheetsService.js";

/**
 * Listens to form changes for cheatsheet editor
 */
export function handleFormUpdates(csUUID, form) {
  // Listen for changes
  let timer;

  // Inputs
  form.addEventListener("selectionchange", (e) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const value = e.target.value;
      const field = e.target.id;
      const updateObject = {
        [field]: value
      };

      await cheatsheetService.updateCheatsheet(csUUID, updateObject);

      // @todo backup if internet connection fails
      // if no internetion connection, store value in window.sessionStorage
      // window.sessionStorage.setItem("markdown", value);
    }, 1000);
  });

  // @todo make checkboxes work for autosave
  // Ranges
  const ranges = document.querySelectorAll("input[type=range]");
  ranges.forEach(range => {
    range.addEventListener("change", async (e) => {
      const value = e.target.value;
      const field = e.target.id;
      const updateObject = {
        [field]: value
      }
      await cheatsheetService.updateCheatsheet(csUUID, updateObject);

      const iframe = document.getElementById("cs_frame");
      iframe.src = iframe.src;
    });
  });

  // Public Checkbox
  const checkbox = document.getElementById("public");
  checkbox.addEventListener("change", async (e) => {
    const value = e.target.checked ? 1 : 0;
    const field = e.target.id;
    const updateObject = {
      [field]: value
    }

    console.log(updateObject);
    await cheatsheetService.updateCheatsheet(csUUID, updateObject);
  });
}