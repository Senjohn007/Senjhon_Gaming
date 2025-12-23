// src/games/username.js
import { getCurrentUser } from "../auth"; // path is correct in your setup

const GUEST_ID_KEY = "guestPlayerId";
const GUEST_NAME_KEY = "guestName";

function ensureGuestId() {
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = "guest-" + Math.random().toString(36).slice(2);
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function initUsernameUI() {
  const input = document.getElementById("player-name");
  const saveBtn = document.getElementById("save-name");

  const user = getCurrentUser(); // may be null if not logged in

  // initialise input
  if (input) {
    if (user) {
      input.value = user.name;
      input.readOnly = true; // logged-in name is fixed
    } else {
      input.value =
        localStorage.getItem(GUEST_NAME_KEY) || "Guest";
      input.readOnly = false;
    }
  }

  // guest name save button
  if (saveBtn) {
    // remove old listeners if React re-mounted
    const freshBtn = saveBtn.cloneNode(true);
    saveBtn.replaceWith(freshBtn);

    freshBtn.addEventListener("click", () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        alert(`You are logged in as ${currentUser.name}`);
        return;
      }
      if (!input) return;

      const name = input.value.trim() || "Guest";
      localStorage.setItem(GUEST_NAME_KEY, name);
      alert(`Saved name: ${name}`);
    });
  }

  // global helper used by all game scripts
  window.getPlayerInfo = function () {
    const currentUser = getCurrentUser();
    if (currentUser) {
      return {
        id: currentUser.id || currentUser._id, // depending on backend shape
        name: currentUser.name,
        isGuest: false,
      };
    }

    // guest fallback
    const guestId = ensureGuestId();
    const guestName =
      localStorage.getItem(GUEST_NAME_KEY) || "Guest";

    return {
      id: guestId,
      name: guestName,
      isGuest: true,
    };
  };
}
