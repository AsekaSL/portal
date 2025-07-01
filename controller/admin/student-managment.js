const menu = document.querySelector(".hum-menu");
const menuItem = document.querySelector(".menu-item");
const menuButton = document.querySelector(".menu-item");

menu.addEventListener("click", () => {
    menuItem.classList.add("dropdown");
});

menuButton.addEventListener("click", () => {
    menuItem.classList.remove("dropdown");
})