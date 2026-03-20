/**
 * Minimal search functionality, does not use the DB yet
 */
export function publicSearchHandler() {
  const input = document.getElementById("search_public");
  input.addEventListener("input", (e) => {
    console.log(e.target.value);
    const filter = e.target.value.toUpperCase();
    const cheatsheets = document.getElementsByClassName("cheatsheet");

    for (let i = 0; i < cheatsheets.length; i++) {
      const a = cheatsheets[i].dataset.title;
      console.log(a);
      if (a.toUpperCase().indexOf(filter) > -1) {
        cheatsheets[i].style.display = "";
      } else {
        cheatsheets[i].style.display = "none";
      }
    }
  });
}