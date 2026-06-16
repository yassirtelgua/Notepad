let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = null;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const textarea = document.getElementById("note");
const wordCount = document.getElementById("wordCount");
const saveStatus = document.getElementById("saveStatus");
const search = document.getElementById("search");

// LOAD NOTES
function renderNotes(filter = "") {
  list.innerHTML = "";

  notes
    .filter(n => n.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((note, index) => {
      const li = document.createElement("li");
      li.textContent = note.title || "Untitled";
      if (index === current) li.classList.add("active");

      li.onclick = () => loadNote(index);
      list.appendChild(li);
    });
}

// CREATE NEW NOTE
function createNote() {
  notes.push({ title: "", content: "" });
  current = notes.length - 1;
  saveNotes();
  renderNotes();
  loadNote(current);
}

// LOAD NOTE
function loadNote(index) {
  current = index;
  title.value = notes[index].title;
  textarea.value = notes[index].content;
  updateWordCount();
  renderNotes();
}

// SAVE NOTES
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// AUTO SAVE
title.addEventListener("input", saveCurrentNote);
textarea.addEventListener("input", saveCurrentNote);

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

// WORD COUNT
function updateWordCount() {
  const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);
  wordCount.textContent = words.length + " words";
}

// SEARCH
search.addEventListener("input", () => {
  renderNotes(search.value);
});

// THEME TOGGLE
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light"));
}

// LOAD THEME
window.onload = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "true") {
    document.body.classList.add("light");
  }

  renderNotes();
};
