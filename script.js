alert("JS loaded");

document.addEventListener("DOMContentLoaded", () => {
  const note = document.getElementById("note");
  const preview = document.getElementById("preview");
  const timerDisplay = document.getElementById("timer");
  const stats = document.getElementById("stats");

  const clearBtn = document.getElementById("clearBtn");
  const exportBtn = document.getElementById("exportBtn");
  const copyBtn = document.getElementById("copyBtn");
  const historyBtn = document.getElementById("historyBtn");
  const themeBtn = document.getElementById("themeBtn");
  const timerToggleBtn = document.getElementById("timerToggleBtn");
  const shareBtn = document.getElementById("shareBtn");
  const previewBtn = document.getElementById("previewBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  const fontDownBtn = document.getElementById("fontDownBtn");
  const fontUpBtn = document.getElementById("fontUpBtn");
  const boldBtn = document.getElementById("boldBtn");
  const italicBtn = document.getElementById("italicBtn");
  const headingBtn = document.getElementById("headingBtn");

  let fontSize = Number(localStorage.getItem("fontSize")) || 31;
  let previewMode = false;
  let seconds = Number(localStorage.getItem("timerSeconds")) || 0;
  let timerRunning = false;
  let timerInterval = null;

  // Initial load
  note.value = localStorage.getItem("notepadText") || "";
  note.style.fontSize = fontSize + "px";
  preview.style.fontSize = fontSize + "px";

  applySystemTheme();
  updateStats();
  updateTimerDisplay();

  // Autosave
  note.addEventListener("input", () => {
    localStorage.setItem("notepadText", note.value);
    updateStats();

    if (previewMode) {
      preview.innerHTML = parseMarkdown(note.value);
    }
  });

  // Stats
  function updateStats() {
    const text = note.value;
    const characters = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;

    stats.textContent = `${characters} characters, ${words} words`;
  }

  // Font size
  function changeFontSize(amount) {
    fontSize += amount;

    if (fontSize < 14) fontSize = 14;
    if (fontSize > 56) fontSize = 56;

    note.style.fontSize = fontSize + "px";
    preview.style.fontSize = fontSize + "px";

    localStorage.setItem("fontSize", fontSize);
  }

  // Markdown parser
  function parseMarkdown(text) {
    return text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  // Preview toggle
  function togglePreview() {
    previewMode = !previewMode;

    if (previewMode) {
      preview.innerHTML = parseMarkdown(note.value);
      preview.style.display = "block";
      note.style.display = "none";
    } else {
      preview.style.display = "none";
      note.style.display = "block";
      note.focus();
    }
  }

  // Format text
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

  // Clear note
  function clearNote() {
    const confirmClear = confirm("Clear this note?");
    if (!confirmClear) return;

    note.value = "";
    localStorage.removeItem("notepadText");
    updateStats();
    note.focus();
  }

  // Export note
  function exportNote() {
    const blob = new Blob([note.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "note.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

  // Copy note
  async function copyNote() {
    try {
      await navigator.clipboard.writeText(note.value);
      alert("Copied ✅");
    } catch {
      alert("Copy failed. Select text manually and press Ctrl+C.");
    }
  }

  // Save history
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

  // Timer display
  function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    timerDisplay.textContent =
      `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  // Timer toggle
  function toggleTimer() {
    timerRunning = !timerRunning;

    if (timerRunning) {
      timerInterval = setInterval(() => {
        seconds++;
        localStorage.setItem("timerSeconds", seconds);
        updateTimerDisplay();
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
  }

  // Theme
  function applySystemTheme() {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    if (prefersLight) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }

  function toggleTheme() {
    document.body.classList.toggle("light");
  }

  // Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Share note
  async function shareNote() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My note",
          text: note.value
        });
      } catch {
        return;
      }
    } else {
      copyNote();
    }
  }

  // Button events
  clearBtn.addEventListener("click", clearNote);
  exportBtn.addEventListener("click", exportNote);
  copyBtn.addEventListener("click", copyNote);
  historyBtn.addEventListener("click", saveHistory);
  themeBtn.addEventListener("click", toggleTheme);
  timerToggleBtn.addEventListener("click", toggleTimer);
  shareBtn.addEventListener("click", shareNote);
  previewBtn.addEventListener("click", togglePreview);
  fullscreenBtn.addEventListener("click", toggleFullscreen);

  fontDownBtn.addEventListener("click", () => changeFontSize(-2));
  fontUpBtn.addEventListener("click", () => changeFontSize(2));
  boldBtn.addEventListener("click", () => formatText("bold"));
  italicBtn.addEventListener("click", () => formatText("italic"));
  headingBtn.addEventListener("click", () => formatText("heading"));

  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", applySystemTheme);
});
``
