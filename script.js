document.addEventListener("DOMContentLoaded", () => {
  const note = document.getElementById("note");
  const preview = document.getElementById("preview");
  const timerDisplay = document.getElementById("timer");
  const stats = document.getElementById("stats");
  const toastContainer = document.getElementById("toastContainer");

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
  let readMode = false;
  let seconds = Number(localStorage.getItem("timerSeconds")) || 0;
  let timerRunning = false;
  let timerInterval = null;

  note.innerHTML = localStorage.getItem("notepadHTML") || "";
  note.style.fontSize = fontSize + "px";
  preview.style.fontSize = fontSize + "px";

  applySystemTheme();
  updateStats();
  updateTimerDisplay();

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");

      setTimeout(() => {
        toast.remove();
      }, 250);
    }, 2500);
  }

  function saveNote() {
    localStorage.setItem("notepadHTML", note.innerHTML);
    localStorage.setItem("notepadText", note.innerText);
  }

  note.addEventListener("input", () => {
    saveNote();
    updateStats();

    if (readMode) {
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
      showToast("Bold applied", "info");
    }

    if (type === "italic") {
      document.execCommand("italic", false, null);
      showToast("Italic applied", "info");
    }

    if (type === "heading") {
      document.execCommand("formatBlock", false, "h1");
      showToast("Heading applied", "info");
    }

    saveNote();
    updateStats();
  }

  function toggleReadMode() {
    readMode = !readMode;

    if (readMode) {
      saveNote();
      preview.innerHTML = note.innerHTML;

      preview.style.display = "block";
      note.style.display = "none";

      document.body.classList.add("read-mode");
      previewBtn.classList.add("active");

      showToast("Read mode enabled", "info");
    } else {
      preview.style.display = "none";
      note.style.display = "block";

      document.body.classList.remove("read-mode");
      previewBtn.classList.remove("active");

      note.focus();

      showToast("Edit mode enabled", "info");
    }
  }

  function clearNote() {
    const confirmClear = confirm("Clear this note?");
    if (!confirmClear) return;

    note.innerHTML = "";
    localStorage.removeItem("notepadHTML");
    localStorage.removeItem("notepadText");

    if (readMode) {
      preview.innerHTML = "";
    }

    updateStats();
    note.focus();

    showToast("Note cleared", "info");
  }

  function exportNote() {
    const blob = new Blob([note.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "note.txt";
    a.click();

    URL.revokeObjectURL(url);

    showToast("Note downloaded ✅", "success");
  }

  async function copyNote() {
    try {
      await navigator.clipboard.writeText(note.innerText);
      showToast("Copied to clipboard ✅", "success");
    } catch {
      showToast("Copy failed. Select text manually and press Ctrl+C.", "error");
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
      showToast("Write something before saving a version.", "error");
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

    showToast("Version saved ✅", "success");
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

    if (readMode) {
      preview.innerHTML = note.innerHTML;
    }

    closeHistoryPanel();
    note.focus();

    showToast("Version restored ✅", "success");
  }

  function deleteVersion(index) {
    const history = getHistory();

    const confirmDelete = confirm("Delete this saved version?");
    if (!confirmDelete) return;

    history.splice(index, 1);
    setHistory(history);
    renderHistoryList();

    showToast("Version deleted", "info");
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

      showToast("Timer started", "success");
    } else {
      clearInterval(timerInterval);
      showToast("Timer stopped", "info");
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
    showToast("Theme changed", "info");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      showToast("Fullscreen enabled", "info");
    } else {
      document.exitFullscreen();
      showToast("Fullscreen disabled", "info");
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
    showToast("Notepad Pro — rich-text notepad with autosave and version history.", "info");
  }

  clearBtn.addEventListener("click", clearNote);
  exportBtn.addEventListener("click", exportNote);
  copyBtn.addEventListener("click", copyNote);
  historyBtn.addEventListener("click", openHistoryPanel);
  themeBtn.addEventListener("click", toggleTheme);
  timerBtn.addEventListener("click", toggleTimer);
  shareBtn.addEventListener("click", shareNote);
  previewBtn.addEventListener("click", toggleReadMode);
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  aboutBtn.addEventListener("click", showAbout);

  fontDownBtn.addEventListener("click", () => {
    changeFontSize(-2);
    showToast("Text size decreased", "info");
  });

  fontUpBtn.addEventListener("click", () => {
    changeFontSize(2);
    showToast("Text size increased", "info");
  });

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
