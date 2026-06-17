let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = 0;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const note = document.getElementById("note");
const fontSelector = document.getElementById("fontSelector");

// Render notes
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

// Create new note
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

// Load note
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

// Save notes
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Update current note
function updateNote() {
  notes[current].title = title.value;
  notes[current].content = note.value;
  notes[current].font = fontSelector.value;

  saveNotes();
  renderNotes();
}

// Events
title.addEventListener("input", updateNote);
note.addEventListener("input", updateNote);

// Delete note
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

// Change font
function changeNoteFont() {
  note.style.fontFamily = fontSelector.value;
  updateNote();
}

// Init
window.onload = () => {
  if (notes.length === 0) {
    createNote();
  } else {
    loadNote(0);
  }
};
``
