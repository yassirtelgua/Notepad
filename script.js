let notes = JSON.parse(localStorage.getItem("notes")) || [];
let current = 0;

const list = document.getElementById("notesList");
const title = document.getElementById("title");
const note = document.getElementById("note");

// RENDER
function render() {
  list.innerHTML = "";

  notes.forEach((n, i) => {
    let li = document.createElement("li");
    li.textContent = n.title || "Untitled";
    if (i === current) li.style.background = "green";
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
  note.style.fontFamily = notes[i].font;
  render();
}

// SAVE
function save() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// UPDATE
function update() {
  notes[current].title = title.value;
  notes[current].content = note.value;
  save();
  render();
}

title.oninput = update;
note.oninput = update;

// DELETE
function deleteNote() {
  notes.splice(current, 1);

  if (notes.length === 0) {
    createNote();
  } else {
    current = 0;
    loadNote(0);
  }

  save();
}

// FONT
function changeFont() {
  const font = document.getElementById("fontSelector").value;
  note.style.fontFamily = font;
  notes[current].font = font;
  save();
}

// FLOAT WINDOW
const floatBtn = document.getElementById("floatBtn");
const floatWin = document.getElementById("floatWin");
const floatNote = document.getElementById("floatNote");

floatBtn.onclick = () => {
  floatWin.style.display =
    floatWin.style.display === "block" ? "none" : "block";
};

// SAVE FLOAT NOTE
floatNote.value = localStorage.getItem("float") || "";

floatNote.oninput = () => {
  localStorage.setItem("float", floatNote.value);
};

// INIT
window.onload = () => {
  if (notes.length === 0) {
    createNote();
  } else {
    loadNote(0);
  }
};
``
