// قواعد الحركة نفسها يديرها chess.js تلقائياً.
// هذا الملف يوفّر واجهة موحّدة لبقية المشروع.

import { chess } from "./board.js";

/** جميع الحركات الممكنة للقطعة في مربّع معيّن (verbose) */
export function movesFrom(square) {
  return chess.moves({ square, verbose: true });
}

/** هل توجد حركة قانونية من from إلى to؟ يُرجع تفاصيل الحركة */
export function findMove(from, to) {
  return movesFrom(from).find(m => m.to === to) || null;
}

/** جميع الحركات القانونية الحالية */
export function allMoves() {
  return chess.moves();
}
