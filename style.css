const textarea = document.getElementById("note");
const saveStatus = document.getElementById("saveStatus");
const wordCount = document.getElementById("wordCount");

// Load saved note
window.onload = () => {
  const saved = localStorage.getItem("note");
  if (saved) textarea.value = saved;

  updateWordCount();
};

// Save + update UI
textarea.addEventListener("input", () => {
  localStorage.setItem("note", textarea.value);

  saveStatus.textContent = "Saving...";
  setTimeout(() => {
    saveStatus.textContent = "Saved ✅";
  }, 500);

  updateWordCount();
});

// Word counter
function updateWordCount() {
  const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
  wordCount.textContent = `${words.length} words`;
}

// Clear note
function clearNote() {
  localStorage.removeItem("note");
  textarea.value = "";
  updateWordCount();
}

// Download as .txt
function downloadNote() {
  const blob = new Blob([textarea.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "note.txt";
  a.click();

  URL.revokeObjectURL(url);
}
``
