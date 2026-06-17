document.addEventListener("DOMContentLoaded", () => {document.addEventListener("DOMContentLoaded", () =>  const preview = document.getElementById("preview");
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

  // Load saved rich text
  note.innerHTML = localStorage.getItem("notepadHTML") || "";
  note.style.fontSize = fontSize + "px";
  preview.style.fontSize = fontSize + "px";

  applySystemTheme();
  updateStats();
  updateTimerDisplay();

  // Autosave rich text
  note.addEventListener("input", () => {
    saveNote();
    updateStats();

    if (previewMode) {
      preview.innerHTML = note.innerHTML;
    }
  });

  function saveNote() {
    localStorage.setItem("notepadHTML", note.innerHTML);
    localStorage.setItem("notepadText", note.innerText);
  }

  function updateStats() {
    const text = note.innerText || "";
    const characters = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;

    stats.textContent = `${characters} characters, ${words} words`;
  }

  function changeFontSize(amount) {
    fontSize += amount;

    if (fontSize < 14) fontSize = 14;
    if (fontSize > 56) fontSize = 56;

    note.style.fontSize = fontSize + "px";
    preview.style.fontSize = fontSize + "px";

    localStorage.setItem("fontSize", fontSize);
  }

  function formatText(type) {
    note.focus();

    if (type === "bold") {
      document.execCommand("bold", false, null);
    }

    if (type === "italic") {
      document.execCommand("italic", false, null);
    }

    if (type === "heading") {
      document.execCommand("formatBlock", false, "h1");
    }

    saveNote();
    updateStats();
  }

  function togglePreview() {
    previewMode = !previewMode;

    if (previewMode) {
      preview.innerHTML = note.innerHTML;
      preview.style.display = "block";
      note.style.display = "none";
    } else {
      preview.style.display = "none";
      note.style.display = "block";
      note.focus();
    }
  }

  function clearNote() {
    const confirmClear = confirm("Clear this note?");
    if (!confirmClear) return;

    note.innerHTML = "";
    localStorage.removeItem("notepadHTML");
    localStorage.removeItem("notepadText");
    updateStats();
    note.focus();
  }

  function exportNote() {
    const blob = new Blob([note.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "note.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

  async function copyNote() {
    try {
      await navigator.clipboard.writeText(note.innerText);
      alert("Copied ✅");
    } catch {
      alert("Copy failed. Select text manually and press Ctrl+C.");
    }
  }

  function saveHistory() {
    const history = JSON.parse(localStorage.getItem("noteHistory")) || [];

    history.push({
      html: note.innerHTML,
      text: note.innerText,
      date: new Date().toISOString()
    });

    if (history.length > 10) {
      history.shift();
    }

    localStorage.setItem("noteHistory", JSON.stringify(history));
    alert("History saved ✅");
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    timerDisplay.textContent =
      `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

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

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  async function shareNote() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My note",
          text: note.innerText
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

  const note = document.getElementById("note");
