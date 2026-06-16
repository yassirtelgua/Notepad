let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = localStorage.getItem("currentNote");
let deletedNote = null;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const textarea = document.getElementById("note");
const wordCount = document.getElementById("wordCount");
const saveStatus = document.getElementById("saveStatus");
const search = document.getElementById("search");
const fontSelector = document.getElementById("fontSelector");

function renderNotes(filter = "") {
  list.innerHTML = "";

  notes
    .filter(n => (n.title || "").toLowerCase().includes(filter.toLowerCase()))
    .forEach((note, index) => {
      const li = document.createElement("li");
      li.textContent = note.title || "Untitled";

      if (index == current) li.classList.add("active");

      li.onclick = () => loadNote(index);
      list.appendChild(li);
    });
}

function createNote() {
  notes.push({ title: "", content: "", font: "Inter" });
  current = notes.length - 1;
  saveNotes();
  loadNote(current);
}

function loadNote(index) {
  current = index;
  localStorage.setItem("currentNote", current);

  title.value = notes[index].title || "";
  textarea.value = notes[index].content || "";

  const font = notes[index].font || "Inter";
  textarea.style.fontFamily = font;
  fontSelector.value = font;

  textarea.style.opacity = 0;
  setTimeout(() => {
    textarea.style.opacity = 1;
  }, 100);

  updateWordCount();
  renderNotes(search.value);
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function saveCurrentNote() {
  if (current === null) return;

  notes[current].title = title.value;
  notes[current].content = textarea.value;
  notes[current].font = textarea.style.fontFamily;

  saveNotes();

  saveStatus.textContent = "Saving...";
  setTimeout(() => {
    saveStatus.textContent = "Saved ✅";
  }, 300);

  updateWordCount();
  renderNotes(search.value);
}

title.addEventListener("input", saveCurrentNote);
textarea.addEventListener("input", saveCurrentNote);

function deleteNote() {
  if (current === null) return;

  deletedNote = notes[current];
  notes.splice(current, 1);

  current = 0;
  saveNotes();
  renderNotes();
  showUndo();
}

function undoDelete() {
  if (!deletedNote) return;

  notes.push(deletedNote);
  deletedNote = null;

  saveNotes();
  renderNotes();
}

function showUndo() {
  const undo = document.createElement("div");
  undo.className = "undo-popup";
  undo.textContent = "Note deleted — click to undo";

  undo.onclick = () => {
    undoDelete();
    document.body.removeChild(undo);
  };

  document.body.appendChild(undo);

  setTimeout(() => {
    if (document.body.contains(undo)) {
      document.body.removeChild(undo);
    }
  }, 5000);
}

function updateWordCount() {
  const words = textarea.value.trim().split(/\s+/).filter(w => w);
  wordCount.textContent = words.length + " words";
}

search.addEventListener("input", () => renderNotes(search.value));

function toggleTheme() {
  document.body.classList.toggle("light");
}

function exportNotes() {
  const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
}

function changeNoteFont() {
  const font = fontSelector.value;
  textarea.style.fontFamily = font;

  if (current !== null) {
    notes[current].font = font;
    saveNotes();
  }
}

window.onload = () => {
  renderNotes();

  if (notes.length === 0) {
    createNote();
  } else {
    loadNote(current || 0);
  }
};
