const note = document.getElementById("note");
const preview = document.getElementById("preview");
const stats = document.getElementById("stats");

let fontSize = 18;
let previewMode = false;

note.value = localStorage.getItem("note") || "";

note.addEventListener("input", () => {
  localStorage.setItem("note", note.value);
  updateStats();
});

function updateStats() {
  const words = note.value.trim().split(/\s+/).filter(w => w).length;
  stats.textContent = words + " words";
}

updateStats();

// FONT SIZE
function changeFontSize(change) {
  fontSize += change;
  note.style.fontSize = fontSize + "px";
}

// PREVIEW
function parseMarkdown(text) {
  return text
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/\n/g, "<br>");
}

function togglePreview() {
  previewMode = !previewMode;

  if (previewMode) {
    preview.innerHTML = parseMarkdown(note.value);
    preview.style.display = "block";
    note.style.display = "none";
  } else {
    preview.style.display = "none";
    note.style.display = "block";
  }
}

// FORMAT
function formatText(symbol) {
  const start = note.selectionStart;
  const end = note.selectionEnd;

  const selected = note.value.slice(start, end);
  const newText = symbol + selected + symbol;

  note.setRangeText(newText);
}

// CLEAR
function clearNote() {
  note.value = "";
  localStorage.removeItem("note");
  updateStats();
}
