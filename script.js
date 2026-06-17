let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = 0;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const note = document.getElementById("note");
const fontSelector = document.getElementById("fontSelector");

// RENDER
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
  notes.push({
    title: "",
    content: "",
    font: "Inter"
  });

  current = notes.length - 1;
  saveNotes();
  loadNote(current);
}

// LOAD
function loadNote(index) {
  current = index;

  const n = notes[index];

  title.value = n.title;
  note.value = n.content;

  const font = n.font || "Inter";
  note.style.fontFamily = font;
  fontSelector.value = font;

  renderNotes();
}

// SAVE
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// UPDATE
function updateNote() {
  notes[current].title = title.value;
  notes[current].content = note.value;
  notes[current].font = fontSelector.value;

  saveNotes();
  renderNotes();
}

title.addEventListener("input", updateNote);
note.addEventListener("input", updateNote);

// DELETE
function deleteNote() {
  notes.splice(current, 1);

  if (notes.length === 0) {
    createNote();
  } else {
    current = Math.max(0, current - 1);
    loadNote(current);
  }

  saveNotes();
}

// FONT
function changeNoteFont() {
  note.style.fontFamily = fontSelector.value;
  updateNote();
}

/* ✅ FLOAT FEATURE */

// Elements
const floatBtn = document.getElementById("floatBtn");
const floatWindow = document.getElementById("floatWindow");
const floatNote = document.getElementById("floatNote");

// Toggle window
floatBtn.onclick = () => {
  floatWindow.style.display =
    floatWindow.style.display === "flex" ? "none" : "flex";
};

// Save floating note
floatNote.value = localStorage.getItem("floatingNote") || "";

floatNote.addEventListener("input", () => {
  localStorage.setItem("floatingNote", floatNote.value);
});

// DRAGGING
const header = document.getElementById("floatHeader");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - floatWindow.offsetLeft;
  offsetY = e.clientY - floatWindow.offsetTop;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  floatWindow.style.left = e.clientX - offsetX + "px";
  floatWindow.style.top = e.clientY - offsetY + "px";
});

// INIT
window.onload = () => {
  if (notes.length === 0) {
    createNote();
  } else {
    loadNote(0);
  }
};
