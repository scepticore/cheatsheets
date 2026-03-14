import {cheatsheetsService} from "../services/cheatsheetsService.js";

export async function deleteHandler() {
  const deleteButton = document.querySelectorAll(".delete_cheatsheet");

  deleteButton.forEach(button => {
    button.addEventListener("click", async (event) => {
      const btn = event.currentTarget;
      const csid = btn.dataset.csid;
      console.log(csid);

      if(confirm(`Do you really want to delete this cheatsheet?`)){
        try {
          await cheatsheetsService.updateCheatsheet(csid, {"status": "0"});
          window.location.reload();
        } catch (e) {
          console.error(e);
        }
      }
    });
  });
}