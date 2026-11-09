import { state } from "../state.js";
import * as boardUI from "./boardUI.js";
import * as gameUI from "./gameUI.js";
import { sound, notice } from "../utils/helpers.js";

export function comingSoon(name) {
  sound();
  notice("✨ " + name + " - قريباً في تحديث جديد!");
}

export function openSettings() {
  sound();
  document.getElementById("settings").style.display = "flex";
}

export function closeSettings() {
  sound();
  document.getElementById("settings").style.display = "none";
}

export function startGame() {
  sound();
  document.getElementById("menuScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  state.gameStarted = true;

  if (!state.initialized) {
    boardUI.makeBoard();
    state.initialized = true;
  }

  gameUI.newGame();
  setTimeout(boardUI.onResize, 100);
}

export function backMenu() {
  sound();
  state.gameStarted = false;
  state.thinking = false;
  state.pendingPromotion = null;
  state.selected = null;
  document.getElementById("promotion").style.display = "none";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("menuScreen").style.display = "block";
}
