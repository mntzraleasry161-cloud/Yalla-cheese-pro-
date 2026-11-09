export function sound() {
  if (!document.getElementById("sound").checked) return;

  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 650;
    gain.gain.setValueAtTime(.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12);

    osc.start();
    osc.stop(ctx.currentTime + .12);
    osc.onended = () => { try { ctx.close(); } catch(e){} };
  } catch(e) {}
}

export function notice(msg) {
  document.getElementById("notice").textContent = msg;
}
