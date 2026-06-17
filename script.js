// FLOAT WINDOW TOGGLE
const floatingBtn = document.getElementById("floatingBtn");
const floatingWindow = document.getElementById("floatingWindow");
const floatingNote = document.getElementById("floatingNote");

floatingBtn.onclick = () => {
  floatingWindow.style.display =
    floatingWindow.style.display === "flex" ? "none" : "flex";
};

// SAVE FLOAT NOTE
floatingNote.value = localStorage.getItem("floatingNote") || "";

floatingNote.addEventListener("input", () => {
  localStorage.setItem("floatingNote", floatingNote.value);
});

// DRAGGING
const header = document.getElementById("floatingHeader");

let isDragging = false, offsetX, offsetY;

header.onmousedown = (e) => {
  isDragging = true;
  offsetX = e.clientX - floatingWindow.offsetLeft;
  offsetY = e.clientY - floatingWindow.offsetTop;
};

document.onmouseup = () => {
  isDragging = false;
};

document.onmousemove = (e) => {
  if (!isDragging) return;

  floatingWindow.style.left = e.clientX - offsetX + "px";
  floatingWindow.style.top = e.clientY - offsetY + "px";
};
``
