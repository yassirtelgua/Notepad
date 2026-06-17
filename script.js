let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = 0;
let deletedNote = null;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const textarea = document.getElementById("note");
const fontSelector = document.getElementById("fontSelector");

// RENDER
function renderNotes() {
  list.innerHTML = "";
  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.textContent = note.title || "Untitled";
    if (index === current) li.classList.add("active");
    li.onclick = () => loadNote(index);
    list.appendChild(li);
  });
}

// CREATE
function createNote() {
  notes.push({ title: "", content: "", font: "Inter" });
  current = notes.length - 1;
  saveNotes();
  loadNote(current);
}

// LOAD
function loadNote(i) {
  current = i;
  title.value = notes[i].title;
  textarea.value = notes[i].content;
  textarea.style.fontFamily = notes[i].font;
  fontSelector.value = notes[i].font;

  textarea.style.opacity = 0;
  setTimeout(() => textarea.style.opacity = 1, 100);

  renderNotes();
}

// SAVE
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// AUTO SAVE
function saveCurrent() {
  notes[current].title = title.value;
  notes[current].content = textarea.value;
  notes[current].font = fontSelector.value;
  saveNotes();
  renderNotes();
}

title.oninput = saveCurrent;
textarea.oninput = saveCurrent;

// DELETE
function deleteNote() {
  deletedNote = notes[current];
  notes.splice(current, 1);
  current = 0;
  saveNotes();
  renderNotes();
  showUndo();
}

// UNDO
function showUndo() {
  const div = document.createElement("div");
  div.className = "undo-popup";
  div.textContent = "Note deleted — click to undo";
  div.onclick = () => {
    notes.push(deletedNote);
    saveNotes();
    renderNotes();
    div.remove();
  };
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 5000);
}

// FONT
function changeNoteFont() {
  textarea.style.fontFamily = fontSelector.value;
  saveCurrent();
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
}

// EXPORT
function exportNotes() {
  const blob = new Blob([JSON.stringify(notes)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
}

// FLOATING WINDOW
const floatBtn = document.getElementById("floatingBtn");
const floatWin = document.getElementById("floatingWindow");
const floatNote = document.getElementById("floatingNote");

floatBtn.onclick = () => {
  floatWin.style.display = floatWin.style.display === "flex" ? "none" : "flex";
};

floatNote.value = localStorage.getItem("floatingNote") || "";
floatNote.oninput = () => {
  localStorage.setItem("floatingNote", floatNote.value);
};

// DRAG
const header = document.getElementById("floatingHeader");
let drag = false, offX, offY;

header.onmousedown = e => {
  drag = true;
  offX = e.clientX - floatWin.offsetLeft;
  offY = e.clientY - floatWin.offsetTop;
};

document.onmouseup = () => drag = false;

document.onmousemove = e => {
  if (!drag) return;
  floatWin.style.left = e.clientX - offX + "px";
  floatWin.style.top = e.clientY - offY + "px";
};

// INIT
window.onload = () => {
  if (notes.length === 0) createNote();
  else loadNote(0);
};
