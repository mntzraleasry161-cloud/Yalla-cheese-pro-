export const state = {
  selected: null,          // المربع المختار حالياً
  thinking: false,         // الكمبيوتر يفكر
  pendingPromotion: null,  // { from, to } بانتظار اختيار الترقية
  snapshots: [],           // لقطات للتراجع
  gameStarted: false,
  initialized: false
};
