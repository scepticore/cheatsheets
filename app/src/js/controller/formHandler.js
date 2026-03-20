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

  const inputs = document.querySelectorAll("input[id=title], textarea[id=description]");
  inputs.forEach(input => {
    const lengthIndicator = document.getElementById(`length_indicator_${input.id}`);
    lengthCounter(input, lengthIndicator);
  });

}

/**
 * Indicates length of user input, if maxLength is set
 * @param {object} fieldElement - Element that changes its value
 * @param {object} lengthIndicator - Span Element to display the current length and max length
 */
function lengthCounter(fieldElement, lengthIndicator) {
  fieldElement.addEventListener("input", (e) => {
    lengthIndicator.textContent = `${e.target.value.length} / ${fieldElement.getAttribute("maxlength")}`;
    if (Number(e.target.value.length) === Number(fieldElement.getAttribute("maxlength"))) {
      lengthIndicator.classList.add("max_reached");
    } else {
      if (lengthIndicator.classList.contains("max_reached")) {
        lengthIndicator.classList.remove("max_reached");
      }
    }
  });
}