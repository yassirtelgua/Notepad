const note = document.getElementById("note");
const stats = document.getElementById("stats");
const timerDisplay = document.getElementById("timer");

// LOAD NOTE
note.value = localStorage.getItem("note") || "";

// SAVE NOTE
note.addEventListener("input", () => {
  localStorage.setItem("note", note.value);
  updateStats();
});

// UPDATE STATS
function updateStats() {
  const text = note.value;

  const words = text.trim().split(/\s+/).filter(w => w).length;
  const chars = text.length;

  stats.textContent = `${chars} characters, ${words} words`;
}

updateStats();

// DELETE
function deleteNote() {
  note.value = "";
  localStorage.removeItem("note");
  updateStats();
}

// EXPORT
function exportNotes() {
  const blob = new Blob([note.value], { type: "text/plain" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "note.txt";
  a.click();
}

// TIMER
let time = 0;
let timerInterval = null;

function toggleTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  } else {
    timerInterval = setInterval(() => {
      time++;
      updateTimer();
    }, 1000);
  }
}

function updateTimer() {
  let min = Math.floor(time / 60);
  let sec = time % 60;

  timerDisplay.textContent =
    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
}
