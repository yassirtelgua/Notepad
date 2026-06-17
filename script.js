const note = document.getElementById("note");const note = document.get");
const stats = document.getElementById("stats");

let fontSize = 18;
let previewMode = false;

// ✅ LOAD
note.value = localStorage.getItem("note") || "";

// ✅ AUTO SAVE + HISTORY
note.addEventListener("input", () => {
  localStorage.setItem("note", note.value);

  // Save history (last 5 versions)
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(note.value);
  if (history.length > 5) history.shift();
  localStorage.setItem("history", JSON.stringify(history));

  updateStats();
});

function updateStats() {
  const words = note.value.trim().split(/\s+/).filter(w => w).length;
  stats.textContent = words + " words";
}

updateStats();

// ✅ FONT SIZE
function changeFontSize(change) {
  fontSize += change;
  note.style.fontSize = fontSize + "px";
}

// ✅ MARKDOWN SIMPLE PARSER
function parseMarkdown(text) {
  return text
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/\n/g, "<br>");
}

// ✅ PREVIEW TOGGLE
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

// ✅ FORMAT HELPERS
function formatText(symbol) {
  const start = note.selectionStart;
  const end = note.selectionEnd;

  const selected = note.value.slice(start, end);

  const newText = symbol + selected + symbol;

  note.setRangeText(newText);
}

// ✅ CLEAR
function clearNote() {
  note.value = "";
  localStorage.removeItem("note");
}

// ✅ AUTO THEME
function autoTheme() {
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
  }
}

autoTheme();
``
