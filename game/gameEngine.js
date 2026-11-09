import { chess } from "./board.js";

/** تقييم اللوحة من منظور الأبيض (موجب = لصالح الأبيض) */
export function evaluate() {
  if (chess.isCheckmate()) {
    return chess.turn() === "w" ? -100000 : 100000;
  }
  if (chess.isDraw()) return 0;

  const values = { p:100, n:320, b:330, r:500, q:900, k:20000 };
  let score = 0;

  chess.board().forEach((row, r) => {
    row.forEach((p, f) => {
      if (!p) return;

      let value = values[p.type];

      if (p.type === "p") {
        value += (p.color === "b" ? r : 7 - r) * 4;
      }

      const center = 7 - (Math.abs(3.5 - f) + Math.abs(3.5 - r));
      value += center * 2;

      score += p.color === "w" ? value : -value;
    });
  });

  return score;
}

/** minimax مع alpha-beta pruning */
export function minimax(depth, alpha, beta, maximizing) {
  if (depth === 0 || chess.isGameOver()) return evaluate();

  const moves = chess.moves();

  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      chess.move(m);
      best = Math.max(best, minimax(depth - 1, alpha, beta, false));
      chess.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      chess.move(m);
      best = Math.min(best, minimax(depth - 1, alpha, beta, true));
      chess.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

/** يختار حركة الكمبيوتر (الأسود) دون تطبيقها */
export function chooseComputerMove(level) {
  if (chess.isGameOver()) return null;

  const moves = chess.moves();
  if (!moves.length) return null;

  if (level === "easy") {
    const captures = moves.filter(m => m.includes("x"));
    const pool = Math.random() < .5 && captures.length ? captures : moves;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let best = Infinity;
  let chosen = null;

  for (const m of moves) {
    chess.move(m);
    const score = minimax(2, -Infinity, Infinity, true);
    chess.undo();

    if (score < best) {
      best = score;
      chosen = m;
    }
  }

  return chosen;
}

/** يطبّق حركة على كائن الشطرنج، يرجع تفاصيل الحركة أو null */
export function applyMove(from, to, promotion = "q") {
  try {
    return chess.move({ from, to, promotion });
  } catch(e) {
    return null;
  }
}

/** يحفظ لقطة (FEN + التاريخ) في مكدّس snapshots */
export function saveSnapshot(snapshots) {
  snapshots.push({
    fen: chess.fen(),
    history: [...chess.history()]
  });
}

/** نص حالة اللعبة { text, over } */
export function getStatusText() {
  if (chess.isCheckmate()) {
    return {
      text: "🏆 كش مات! " + (chess.turn() === "w" ? "الأسود" : "الأبيض") + " فاز!",
      over: true
    };
  }
  if (chess.isStalemate()) {
    return { text: "🤝 تعادل بسبب الجمود!", over: true };
  }
  if (chess.isDraw()) {
    return { text: "🤝 المباراة انتهت بالتعادل", over: true };
  }
  if (chess.isCheck()) {
    return { text: "⚠️ كش! الملك مهدد", over: false };
  }
  return {
    text: chess.turn() === "w" ? "دورك الآن - الأبيض" : "🤖 الكمبيوتر يفكر...",
    over: false
  };
}
