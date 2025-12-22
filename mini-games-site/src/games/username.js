// src/games/username.js
import { getCurrentUser } from "../auth"; // adjust path

export function initUsernameUI() {
  const input = document.getElementById("player-name");
  const saveBtn = document.getElementById("save-name");

  const user = getCurrentUser();

  if (input) {
    input.value = user ? user.name : "Guest";
    input.readOnly = !!user; // if logged in, lock the name
  }

  if (saveBtn) {
    // If you still want guests to save a temporary name:
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const freshBtn = document.getElementById("save-name");
    freshBtn.addEventListener("click", () => {
      if (user) {
        alert(`You are logged in as ${user.name}`);
        return;
      }
      const name = input.value.trim() || "Guest";
      localStorage.setItem("guestName", name);
      alert(`Saved name: ${name}`);
    });
  }

  // global helper used by game scripts
  window.getPlayerInfo = function () {
    const u = getCurrentUser();
    if (u) {
      return {
        id: u.id,
        name: u.name,
        isGuest: false,
      };
    }

    // fallback for guests
    return {
      id: localStorage.getItem("playerId") || "guest-" + Math.random().toString(36).slice(2),
      name: localStorage.getItem("guestName") || "Guest",
      isGuest: true,
    };
  };
}
