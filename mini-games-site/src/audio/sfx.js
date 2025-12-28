// src/audio/sfx.js
const clickSound = new Audio("/assets/audio/click.mp3");
const successSound = new Audio("/assets/audio/success.mp3");
const failSound = new Audio("/assets/audio/fail.mp3");

export function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

export function playSuccess() {
  successSound.currentTime = 0;
  successSound.play();
}

export function playFail() {
  failSound.currentTime = 0;
  failSound.play();
}
