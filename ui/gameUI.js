import { chess } from "../game/board.js";
import { state } from "../state.js";
import * as engine from "../game/gameEngine.js";
import * as moves from "../game/moves.js";
import * as boardUI from "./boardUI.js";
import { sound, notice } from "../utils/helpers.js";

// ===== أدوات عرض =====
function updateMovesDisplay() {
  document.getElementById("moves").textContent =
    chess.history().join("  ");
}

export function updateStatus() {
  const { text, over } = engine.getStatusText();
  document.getElementById("status").textContent = text;
  return over;
}

// ===== تطبيق حركة اللاعب =====
function makeMove(from, to, promotion = "q") {
  const move = engine.applyMove(from, to, promotion);
  if (!move) return false;

  boardUI.draw();
  boardUI.resetColors();
  state.selected = null;
  updateMovesDisplay();
  sound();
  return true;
}

// ===== دور الكمبيوتر =====
function computerTurn() {
  const level = document.getElementById("level").value;
  const chosen = engine.chooseComputerMove(level);

  if (chosen) {
    chess.move(chosen);
    boardUI.draw();
    updateMovesDisplay();
    sound();
    updateStatus();
  }
}

// ===== تنفيذ حركة اللاعب ثم دور الكمبيوتر =====
function executePlayerMove(from, to, promotion) {
  if (!makeMove(from, to, promotion)) return;

  document.getElementById("promotion").style.display = "none";

  if (updateStatus()) return;

  state.thinking = true;

  setTimeout(() => {
    if (state.gameStarted && !chess.isGameOver()) {
      computerTurn();
      updateStatus();
    }
    state.thinking = false;
  }, 350);
}

// ===== معالج النقر على الرقعة =====
function onClick(event) {
  if (!state.gameStarted || state.thinking || chess.isGameOver() || state.pendingPromotion) return;
  if (chess.turn() !== "w") return;

  const clickedSquare = boardUI.getClickedSquare(event.clientX, event.clientY);
  if (!clickedSquare) return;

  if (state.selected) {
    const move = moves.findMove(state.selected, clickedSquare);

    if (move) {
      if (move.promotion) {
        state.pendingPromotion = { from: state.selected, to: clickedSquare };
        document.getElementById("promotion").style.display = "block";
        return;
      }

      engine.saveSnapshot(state.snapshots);
      executePlayerMove(state.selected, clickedSquare);
      return;
    }

    // إعادة اختيار قطعة بيضاء أخرى
    const targetPiece = chess.get(clickedSquare);
    if (targetPiece && targetPiece.color === "w") {
      state.selected = clickedSquare;
      boardUI.showMoves(state.selected);
      sound();
      return;
    }

    // إلغاء الاختيار
    state.selected = null;
    boardUI.resetColors();
    return;
  }

  // اختيار قطعة بيضاء جديدة
  const piece = chess.get(clickedSquare);
  if (piece && piece.color === "w") {
    state.selected = clickedSquare;
    boardUI.showMoves(state.selected);
    sound();
  }
}

// ===== ربط أحداث المؤشر =====
export function setupPointerEvents(canvas) {
  let downX = 0, downY = 0;

  canvas.addEventListener("pointerdown", (e) => {
    downX = e.clientX;
    downY = e.clientY;
  });

  canvas.addEventListener("pointerup", (e) => {
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      onClick(e);
    }
  });
}

// ===== أزرار اللعب =====
export function newGame() {
  sound();
  chess.reset();
  state.snapshots = [];
  state.selected = null;
  state.pendingPromotion = null;
  state.thinking = false;

  document.getElementById("promotion").style.display = "none";
  document.getElementById("moves").textContent = "سجل الحركات سيظهر هنا";

  boardUI.resetColors();
  boardUI.draw();
  updateStatus();
}

export function undoMove() {
  if (!state.gameStarted || state.thinking || state.pendingPromotion) return;
  if (state.snapshots.length === 0) {
    notice("لا توجد حركات للتراجع عنها");
    return;
  }

  const snap = state.snapshots.pop();
  try { chess.load(snap.fen); } catch(e) { return; }

  state.selected = null;
  state.pendingPromotion = null;
  document.getElementById("promotion").style.display = "none";

  boardUI.resetColors();
  boardUI.draw();

  document.getElementById("moves").textContent =
    snap.history.length ? snap.history.join("  ") : "سجل الحركات سيظهر هنا";

  updateStatus();
  sound();
}

export function promote(piece) {
  if (!state.pendingPromotion) return;
  sound();

  const { from, to } = state.pendingPromotion;
  state.pendingPromotion = null;

  document.getElementById("promotion").style.display = "none";

  engine.saveSnapshot(state.snapshots);
  executePlayerMove(from, to, piece);
}
