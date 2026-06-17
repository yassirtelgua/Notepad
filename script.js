const note = document.getElementById("note");const note = documentElementById("preview");
const stats = document.getElementById("stats");
const timerDisplay = document.getElementById("timer");

let fontSize = Number(localStorage.getItem("fontSize")) || 24;
let previewMode = false;
let seconds = 0;

note.style.fontSize = fontSize + "px";
preview.style.fontSize = fontSize + "px";

note.value = localStorage.getItem("notepadText") || "";
updateStats();

/* AUTOSAVE */
note.addEventListener("input", () => {
  localStorage.setItem("notepadText", note.value);
  updateStats();
});

/* STATS */
function updateStats() {
  const text = note.value;
  const characters = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  stats.textContent = `${characters} characters, ${words} words`;
}

/* FONT SIZE */
function changeFontSize(amount) {
  fontSize += amount;

  if (fontSize < 14) fontSize = 14;
  if (fontSize > 48) fontSize = 48;

  note.style.fontSize = fontSize + "px";
  preview.style.fontSize = fontSize + "px";

  localStorage.setItem("fontSize", fontSize);
}

/* MARKDOWN */
function parseMarkdown(text) {
  return text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
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

/* FORMAT TOOLBAR */
function formatText(type) {
  note.focus();

  const start = note.selectionStart;
  const end = note.selectionEnd;
  const selected = note.value.slice(start, end);

  let formatted = selected;

  if (type === "bold") {
    formatted = `**${selected || "bold text"}**`;
  }

  if (type === "italic") {
    formatted = `*${selected || "italic text"}*`;
  }

  if (type === "heading") {
    formatted = `# ${selected || "Heading"}`;
  }

  note.setRangeText(formatted, start, end, "end");

  localStorage.setItem("notepadText", note.value);
  updateStats();
}

/* SAVE HISTORY */
function saveHistory() {
  const history = JSON.parse(localStorage.getItem("noteHistory")) || [];

  history.push({
    text: note.value,
    date: new Date().toISOString()
  });

  if (history.length > 10) {
    history.shift();
  }

  localStorage.setItem("noteHistory", JSON.stringify(history));

  alert("History saved ✅");
}

/* CLEAR */
function clearNote() {
  const confirmClear = confirm("Clear this note?");

  if (!confirmClear) return;

  note.value = "";
  localStorage.removeItem("notepadText");
  updateStats();
}

/* TIMER */
setInterval(() => {
  seconds++;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}, 1000);

/* AUTO THEME */
function applySystemTheme() {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  if (prefersLight) {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

applySystemTheme();

window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", applySystemTheme);
