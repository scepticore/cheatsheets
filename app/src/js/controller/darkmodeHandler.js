/**
 * Checks for dark mode preference and applies it
 * @todo include this one in the orchid
 * @return {void} - returns nothing, changes document class list "dark-mode"
 */
export function checkDarkMode(){
  const darkModeToggle = document.getElementById("dark_mode_toggle");
  window.addEventListener("DOMContentLoaded", () => {
    // Set dark mode based on local storage
    if(window.localStorage.getItem("dark_mode") === "true") {
      document.documentElement.classList.add("dark-mode");
      darkModeToggle.checked = true;
    } else {
      document.documentElement.classList.remove("dark-mode");
      darkModeToggle.checked = false;
    }
  });
  // Listen for toggle changes and apply them
  darkModeToggle.addEventListener("change", (event) => {
    window.localStorage.setItem("dark_mode", darkModeToggle.checked ? "true" : "false");
    document.documentElement.classList.toggle("dark-mode");
  });
}