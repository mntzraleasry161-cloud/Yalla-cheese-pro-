// ============================================================
//  نظام المصادقة — غير مفعّل بعد
//  يُستخدم لاحقاً عند إضافة شاشة تسجيل الدخول
// ============================================================

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function login(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}
