const textarea = document.getElementById("note");

// Load saved note
window.onload = () => {
  const saved = localStorage.getItem("note");
  if (saved) {
    textarea.value = saved;
  }
};

// Save automatically when typing
textarea.addEventListener("input", () => {
  localStorage.setItem("note", textarea.value);
});

// Clear button
function clearNote() {
  localStorage.removeItem("note");
  textarea.value = "";
}
