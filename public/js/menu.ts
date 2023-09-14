const menuBtn = document.getElementById("menu-btn") as HTMLElement;
const menu = document.querySelector("#menu ul") as HTMLElement;
const closeMenu = document.getElementById("close-menu") as HTMLElement;

menuBtn.addEventListener("click", () => {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
})

closeMenu.addEventListener("click", () => {
    menu.classList.add("hidden");
})