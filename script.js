let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = localStorage.getItem("currentNote");
let deletedNote = null;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const textarea = document.getElementById("note");
const wordCount = document.getElementById("wordCount");
const saveStatus = document.getElementById("saveStatus");
const search = document.getElementById("search");

// RENDER
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

// CREATE
function createNote() {
  notes.push({ title: "", content: "" });
  current = notes.length - 1;
  saveNotes();
  loadNote(current);
}

// LOAD
function loadNote(index) {
  current = index;
  localStorage.setItem("currentNote", current);

  title.value = notes[index].title || "";
  textarea.value = notes[index].content || "";

  updateWordCount();
  renderNotes(search.value);
}

// SAVE
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// AUTO SAVE
function saveCurrentNote() {
  if (current === null) return;

  notes[current].title = title.value;
  notes[current].content = textarea.value;

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

// ✅ DELETE WITH UNDO
function deleteNote() {
  if (current === null) return;

  deletedNote = notes[current];

  notes.splice(current, 1);

  if (notes.length === 0) {
    current = null;
    title.value = "";
    textarea.value = "";
  } else {
    current = 0;
    loadNote(current);
  }

  saveNotes();
  renderNotes();

  showUndo();
}

// ✅ UNDO
function undoDelete() {
  if (!deletedNote) return;

  notes.push(deletedNote);
  deletedNote = null;

  saveNotes();
  renderNotes();
}

// ✅ POPUP
function showUndo() {
  const undo = document.createElement("div");
  undo.className = "undo-popup";
  undo.textContent = "Note deleted ❌ — Click to undo";

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

// WORD COUNT
function updateWordCount() {
  const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);
  wordCount.textContent = words.length + " words";
}

// SEARCH
search.addEventListener("input", () => {
  renderNotes(search.value);
});

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light"));
}

// EXPORT
function exportNotes() {
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
}

// FONT SWITCHER
const fonts = ["Inter", "Roboto", "Playfair Display"];
let fontIndex = 0;

function changeFont() {
  fontIndex = (fontIndex + 1) % fonts.length;
  document.body.style.fontFamily = fonts[fontIndex];
  localStorage.setItem("font", fonts[fontIndex]);
}

// INIT
window.onload = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "true") document.body.classList.add("light");

  const savedFont = localStorage.getItem("font");
  if (savedFont) document.body.style.fontFamily = savedFont;

  renderNotes();

  if (current !== null && notes[current]) {
    loadNote(current);
  }
};
