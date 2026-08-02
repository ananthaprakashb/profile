const root = document.documentElement;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("#site-nav");
const navToggle = document.querySelector(".nav-toggle");
const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("ap-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
root.dataset.theme = savedTheme || preferredTheme;

function syncThemeLabel() {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  themeToggle?.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
}

syncThemeLabel();

themeToggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("ap-theme", root.dataset.theme);
  syncThemeLabel();
});

function closeNav() {
  nav?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNav();
});

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 16);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -64%", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

const filters = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-category]");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;
    filters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    projects.forEach((project) => {
      const categories = project.dataset.category.split(" ");
      project.hidden = selected !== "all" && !categories.includes(selected);
    });
  });
});

const copyButton = document.querySelector(".copy-email");
copyButton?.addEventListener("click", async () => {
  const original = copyButton.textContent;
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyButton.textContent = "Email copied ✓";
  } catch {
    copyButton.textContent = copyButton.dataset.email;
  }
  window.setTimeout(() => {
    copyButton.textContent = original;
  }, 2200);
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
