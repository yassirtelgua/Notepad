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
  const timerBtn = document.getElementById("timerBtn");
  const shareBtn = document.getElementById("shareBtn");
  const previewBtn = document.getElementById("previewBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const aboutBtn = document.getElementById("aboutBtn");

  const fontDownBtn = document.getElementById("fontDownBtn");
  const fontUpBtn = document.getElementById("fontUpBtn");
  const boldBtn = document.getElementById("boldBtn");
  const italicBtn = document.getElementById("italicBtn");
  const headingBtn = document.getElementById("headingBtn");

  const historyPanel = document.getElementById("historyPanel");
  const historyOverlay = document.getElementById("historyOverlay");
  const closeHistoryBtn = document.getElementById("closeHistoryBtn");
  const saveVersionBtn = document.getElementById("saveVersionBtn");
  const historyList = document.getElementById("historyList");

  let fontSize = Number(localStorage.getItem("fontSize")) || 31;
  let previewMode = false;
  let seconds = Number(localStorage.getItem("timerSeconds")) || 0;
  let timerRunning = false;
  let timerInterval = null;

  note.innerHTML = localStorage.getItem("notepadHTML") || "";
  note.style.fontSize = fontSize + "px";
  preview.style.fontSize = fontSize + "px";

  applySystemTheme();
  updateStats();
  updateTimerDisplay();

  function saveNote() {
    localStorage.setItem("notepadHTML", note.innerHTML);
    localStorage.setItem("notepadText", note.innerText);
  }

  note.addEventListener("input", () => {
    saveNote();
    updateStats();

    if (previewMode) {
      preview.innerHTML = note.innerHTML;
    }
  });

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

  function getHistory() {
    return JSON.parse(localStorage.getItem("noteHistory")) || [];
  }

  function setHistory(history) {
    localStorage.setItem("noteHistory", JSON.stringify(history));
  }

  function openHistoryPanel() {
    renderHistoryList();
    historyPanel.classList.add("show");
    historyOverlay.classList.add("show");
  }

  function closeHistoryPanel() {
    historyPanel.classList.remove("show");
    historyOverlay.classList.remove("show");
  }

  function saveCurrentVersion() {
    const text = note.innerText.trim();

    if (!text) {
      alert("Write something before saving a version.");
      return;
    }

    const history = getHistory();

    history.unshift({
      html: note.innerHTML,
      text: note.innerText,
      date: new Date().toISOString()
    });

    if (history.length > 10) {
      history.pop();
    }

    setHistory(history);
    renderHistoryList();
  }

  function renderHistoryList() {
    const history = getHistory();

    historyList.innerHTML = "";

    if (history.length === 0) {
      historyList.innerHTML = `
        <div class="history-empty">
          No saved versions yet. Click "Save Current Version" to create one.
        </div>
      `;
      return;
    }

    history.forEach((version, index) => {
      const item = document.createElement("div");
      item.className = "history-item";

      const date = new Date(version.date);
      const readableDate = date.toLocaleString();

      const shortPreview =
        version.text.length > 120
          ? version.text.slice(0, 120) + "..."
          : version.text || "Empty version";

      item.innerHTML = `
        <div class="history-date">${readableDate}</div>
        <div class="history-preview">${escapeHTML(shortPreview)}</div>
        <div class="history-actions">
          <button class="restore-version-btn" data-index="${index}">Restore</button>
          <button class="delete-version-btn" data-index="${index}">Delete</button>
        </div>
      `;

      historyList.appendChild(item);
    });

    document.querySelectorAll(".restore-version-btn").forEach((button) => {
      button.addEventListener("click", () => {
        restoreVersion(Number(button.dataset.index));
      });
    });

    document.querySelectorAll(".delete-version-btn").forEach((button) => {
      button.addEventListener("click", () => {
        deleteVersion(Number(button.dataset.index));
      });
    });
  }

  function restoreVersion(index) {
    const history = getHistory();
    const version = history[index];

    if (!version) return;

    const confirmRestore = confirm("Restore this version? Your current note will be replaced.");
    if (!confirmRestore) return;

    note.innerHTML = version.html;
    saveNote();
    updateStats();

    if (previewMode) {
      preview.innerHTML = note.innerHTML;
    }

    closeHistoryPanel();
    note.focus();
  }

  function deleteVersion(index) {
    const history = getHistory();

    const confirmDelete = confirm("Delete this saved version?");
    if (!confirmDelete) return;

    history.splice(index, 1);
    setHistory(history);
    renderHistoryList();
  }

  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
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

  function showAbout() {
    alert("Notepad Pro\nA simple rich-text notepad with autosave and version history.");
  }

  clearBtn.addEventListener("click", clearNote);
  exportBtn.addEventListener("click", exportNote);
  copyBtn.addEventListener("click", copyNote);
  historyBtn.addEventListener("click", openHistoryPanel);
  themeBtn.addEventListener("click", toggleTheme);
  timerBtn.addEventListener("click", toggleTimer);
  shareBtn.addEventListener("click", shareNote);
  previewBtn.addEventListener("click", togglePreview);
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  aboutBtn.addEventListener("click", showAbout);

  fontDownBtn.addEventListener("click", () => changeFontSize(-2));
  fontUpBtn.addEventListener("click", () => changeFontSize(2));
  boldBtn.addEventListener("click", () => formatText("bold"));
  italicBtn.addEventListener("click", () => formatText("italic"));
  headingBtn.addEventListener("click", () => formatText("heading"));

  closeHistoryBtn.addEventListener("click", closeHistoryPanel);
  historyOverlay.addEventListener("click", closeHistoryPanel);
  saveVersionBtn.addEventListener("click", saveCurrentVersion);

  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", applySystemTheme);
});
