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

const blogFeed = document.querySelector("[data-blog-feed]");
const blogStatus = document.querySelector("[data-blog-status]");

function plainText(html = "") {
  const reader = document.createElement("div");
  reader.innerHTML = html.replace(/<\s*\/?(?:p|div|br|li|h[1-6])\b[^>]*>/gi, " ");
  return (reader.textContent || "").replace(/\s+/g, " ").trim();
}

function shorten(text, length = 145) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).replace(/\s+\S*$/, "")}…`;
}

function blogLink(entry) {
  const candidate = entry?.link?.find((link) => link.rel === "alternate")?.href;
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    const allowedHosts = new Set(["engineeringstepstone.com", "www.engineeringstepstone.com"]);
    return url.protocol === "https:" && allowedHosts.has(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

function displayDate(value, short = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat("en-US", short
    ? { month: "short", day: "2-digit" }
    : { month: "long", day: "numeric", year: "numeric" }
  ).format(date);
}

function articleRow(entry) {
  const title = entry?.title?.$t?.trim();
  const href = blogLink(entry);
  if (!title || !href) return null;

  const row = document.createElement("article");
  row.className = "article-row";

  const time = document.createElement("time");
  time.dateTime = entry.published?.$t || "";
  time.textContent = displayDate(entry.published?.$t, true);

  const copy = document.createElement("div");
  const heading = document.createElement("h4");
  heading.textContent = title;
  const summary = document.createElement("p");
  summary.textContent = shorten(plainText(entry.summary?.$t || entry.content?.$t || "Read the latest engineering note."));
  copy.append(heading, summary);

  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.setAttribute("aria-label", `Read ${title}`);
  link.textContent = "↗";
  row.append(time, copy, link);
  return row;
}

window.renderEngineeringStepstoneFeed = (payload) => {
  const entries = payload?.feed?.entry || [];
  if (!entries.length) return;

  const latest = entries[0];
  const latestTitle = latest?.title?.$t?.trim();
  const latestUrl = blogLink(latest);
  const latestSummary = plainText(latest?.summary?.$t || latest?.content?.$t || "");

  if (latestTitle) document.querySelector("[data-blog-latest-title]").textContent = latestTitle;
  if (latestSummary) document.querySelector("[data-blog-latest-summary]").textContent = shorten(latestSummary, 420);
  if (latestUrl) document.querySelector("[data-blog-latest-url]").href = latestUrl;
  const latestDate = document.querySelector("[data-blog-latest-date]");
  if (latestDate && latest.published?.$t) {
    latestDate.dateTime = latest.published.$t;
    latestDate.textContent = displayDate(latest.published.$t);
  }

  const rows = entries.slice(1, 5).map(articleRow).filter(Boolean);
  if (blogFeed && rows.length) blogFeed.replaceChildren(...rows);
  if (blogStatus) blogStatus.lastChild.textContent = " Live blog";
};

if (blogFeed) {
  const feedScript = document.createElement("script");
  feedScript.async = true;
  feedScript.src = "https://www.engineeringstepstone.com/feeds/posts/default?alt=json-in-script&max-results=5&callback=renderEngineeringStepstoneFeed";
  feedScript.addEventListener("error", () => {
    if (blogStatus) blogStatus.lastChild.textContent = " Published highlights";
  });
  document.head.append(feedScript);
}

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
