import * as boardUI from "./ui/boardUI.js";
import * as gameUI from "./ui/gameUI.js";
import * as mainMenuUI from "./ui/mainMenuUI.js";

// ربط دوال الـ HTML (onclick="...") بالـ window
window.startGame      = mainMenuUI.startGame;
window.backMenu       = mainMenuUI.backMenu;
window.comingSoon     = mainMenuUI.comingSoon;
window.openSettings   = mainMenuUI.openSettings;
window.closeSettings  = mainMenuUI.closeSettings;
window.newGame        = gameUI.newGame;
window.undoMove       = gameUI.undoMove;
window.promote        = gameUI.promote;

// ربط أحداث المؤشر على الـ canvas
gameUI.setupPointerEvents(boardUI.renderer.domElement);

// الحجم + بدء حلقة العرض
boardUI.onResize();
window.addEventListener("resize", boardUI.onResize);
boardUI.startAnimation();
