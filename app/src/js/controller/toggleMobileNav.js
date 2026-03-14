/**
 * For mobile navigation: toggle visibility of navigation container
 * @return {void} - returns nothing, toggles nav visibility
 */
export function toggleNav() {
  const navToggleButton = document.getElementById("toggle_nav");

  navToggleButton.addEventListener("click", (event) => {
    event.preventDefault();
    let nav = document.getElementsByTagName("nav")[0];
    nav.classList.toggle("hidden");

    let btn = document.getElementsByClassName("toggle_menu")[0];
    btn.classList.toggle("active");
  });
}