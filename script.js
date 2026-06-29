const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

let _toastTimer = null;
function showToast(msg, type = "success") {
  let toast = document.getElementById("_toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "_toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast toast--${type} toast--show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.classList.remove("toast--show");
  }, 3500);
}

// 貼上你的 Google Apps Script 網址
const SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQZuDNFWWH9or3QzrUBrzDPwRzLkASi00_ySqrQojwua2k1KeV4-YkQhm52wtndW4xJg/exec";

function setTheme(theme) {
  root.dataset.theme = theme;

  try {
    localStorage.setItem("studio-theme", theme);
  } catch (error) {
    // Theme still changes for the current page even if storage is unavailable.
  }

  if (themeToggle) {
    const label = theme === "dark" ? "切換淺色模式" : "切換深色模式";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  }
}

if (themeToggle) {
  setTheme(root.dataset.theme || "light");
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

const revealTargets = Array.from(document.querySelectorAll(".reveal"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reducedMotion) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target, index) => {
    target.style.setProperty("--reveal-delay", `${Math.min(index * 35, 210)}ms`);
    observer.observe(target);
  });
}

if (contactForm) {
  const submitBtn = contactForm.querySelector('[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (submitBtn) submitBtn.disabled = true;
    showToast("傳送中…", "success");

    try {
      await fetch(SHEETS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({ name, company, email, message }),
      });

      showToast("已收到！我會盡快回覆你。", "success");
      contactForm.reset();
    } catch {
      showToast("傳送失敗，請直接 Email 聯絡我們。", "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
