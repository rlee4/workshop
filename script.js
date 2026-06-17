const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const contactEmail = "hello@example.com";

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
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`工作室諮詢：${company || name || "流程數位化需求"}`);
    const body = encodeURIComponent(
      [
        `姓名：${name}`,
        `公司 / 品牌名稱：${company || "未填寫"}`,
        `聯絡 Email：${email}`,
        "",
        "想處理的流程或資料問題：",
        message,
      ].join("\n")
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    if (formNote) {
      formNote.textContent = "已整理成 Email 草稿，請確認內容後寄出。";
    }
  });
}
