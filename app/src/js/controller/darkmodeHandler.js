/**
 * Checks for dark mode preference and applies it
 * @return {void} - returns nothing, changes document class list "dark-mode"
 */
export function checkDarkMode(){
  const darkModeToggle = document.getElementById("dark_mode_toggle");
  window.addEventListener("DOMContentLoaded", () => {

    if(window.localStorage.getItem("dark_mode") === "true") {
      document.documentElement.classList.add("dark-mode");
      darkModeToggle.checked = true;
    } else {
      document.documentElement.classList.remove("dark-mode");
      darkModeToggle.checked = false;
    }
  });

  darkModeToggle.addEventListener("change", (event) => {
    window.localStorage.setItem("dark_mode", darkModeToggle.checked ? "true" : "false");
    document.documentElement.classList.toggle("dark-mode");
  });
}