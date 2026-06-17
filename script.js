let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = 0;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const note = document.getElementById("note");
const fontSelector = document.getElementById("fontSelector");

// RENDER NOTES
function renderNotes() {
  list.innerHTML = "";

  notes.forEach((n, i) => {
    const li = document.createElement("li");
    li.textContent = n.title || "Untitled";
    if (i === current) li.classList.add("active");
    li.onclick = () => loadNote(i);
    list.appendChild(li);
  });
}

// CREATE
function createNote() {
  notes.push({ title: "", content: "", font: "Inter" });
  current = notes.length - 1;
  save();
  loadNote(current);
}

// LOAD
function loadNote(i) {
  current = i;

  title.value = notes[i].title;
  note.value = notes[i].content;

  const font = notes[i].font || "Inter";
  note.style.fontFamily = font;
  fontSelector.value = font;

  renderNotes();
}

// SAVE
function save() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// AUTO SAVE
function updateNote() {
  notes[current].title = title.value;
  notes[current].content = note.value;
  notes[current].font = fontSelector.value;

  save();
  renderNotes();
}

title.oninput = updateNote;
note.oninput = updateNote;

// DELETE
function deleteNote() {
  notes.splice(current, 1);

  if (notes.length === 0) {
    createNote();
  } else {
    current = Math.max(0, current - 1);
    loadNote(current);
  }

  save();
}

// FONT
function changeNoteFont() {
  note.style.fontFamily = fontSelector.value;
  updateNote();
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
}

// EXPORT
function exportNotes() {
  const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
}

// FLOAT WINDOW
const btn = document.getElementById("floatingBtn");
const win = document.getElementById("floatingWindow");
const floatNote = document.getElementById("floatingNote");

btn.onclick = () => {
  win.style.display = win.style.display === "block" ? "none" : "block";
};

// SAVE FLOAT NOTE
floatNote.value = localStorage.getItem("floatingNote") || "";
floatNote.oninput = () => {
  localStorage.setItem("floatingNote", floatNote.value);
};

// DRAG
let drag = false, offsetX, offsetY;

document.getElementById("floatingHeader").onmousedown = e => {
  drag = true;
  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;
};

document.onmouseup = () => drag = false;

document.onmousemove = e => {
  if (!drag) return;

  win.style.left = e.clientX - offsetX + "px";
  win.style.top = e.clientY - offsetY + "px";
};

// INIT
window.onload = () => {
  if (notes.length === 0) createNote();
  else loadNote(0);
};
