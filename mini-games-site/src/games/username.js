// src/games/username.js
export function initUsernameUI() {
  const input = document.getElementById("player-name");
  const saveBtn = document.getElementById("save-name");

  let playerId = localStorage.getItem("playerId");
  let playerName = localStorage.getItem("playerName");

  if (!playerId) {
    playerId = "local-" + Math.random().toString(36).slice(2);
    localStorage.setItem("playerId", playerId);
  }

  if (input && playerName) {
    input.value = playerName;
  }

  if (saveBtn && input) {
    // avoid multiple handlers on re‑mount
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const freshBtn = document.getElementById("save-name");
    freshBtn.addEventListener("click", () => {
      playerName = input.value.trim() || "Guest";
      localStorage.setItem("playerName", playerName);
      alert(`Saved name: ${playerName}`);
    });
  }

  // global helper used by game scripts
  window.getPlayerInfo = function () {
    return {
      id: localStorage.getItem("playerId"),
      name: localStorage.getItem("playerName") || "Guest",
    };
  };
}
