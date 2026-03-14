import {cheatsheetsService} from "../services/cheatsheetsService.js";

export async function restoreHandler() {
  const restoreButton = document.querySelectorAll(".restore_cheatsheet");

  restoreButton.forEach(button => {
    button.addEventListener("click", async (event) => {
      const btn = event.currentTarget;
      const csid = btn.dataset.csid;
      console.log(csid);

      if(confirm(`Do you really want to restore this cheatsheet?`)){
        try {
          await cheatsheetsService.updateCheatsheet(csid, {"status": "1"});
          window.location.reload();
        } catch (e) {
          console.error(e);
        }
      }
    });
  });
}