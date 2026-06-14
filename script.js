const header = document.querySelector("[data-header]");
const progress = document.querySelector(".progress");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const marqueeTracks = document.querySelectorAll("[data-marquee-track]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateChrome() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateChrome, { passive: true });
updateChrome();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileMenu.addEventListener("click", (event) => {
  if (!event.target.matches("a")) return;
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
});

function updateMarquees() {
  if (reducedMotion) return;

  marqueeTracks.forEach((track) => {
    const distance = track.scrollWidth / 2;
    const speed = Number(track.dataset.speed || "34");
    const duration = Math.max(distance / speed, 28);

    track.style.setProperty("--marquee-shift", `-${distance}px`);
    track.style.setProperty("--marquee-duration", `${duration}s`);
  });
}

updateMarquees();
window.addEventListener("load", updateMarquees);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateMarquees);

let resizeTimer;
window.addEventListener(
  "resize",
  () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateMarquees, 120);
  },
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.06 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  if (reducedMotion) {
    element.classList.add("visible");
  } else {
    revealObserver.observe(element);
  }
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-menu-grid] .menu-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.kind !== filter);
    });
  });
});

const range = document.querySelector("[data-investment-range]");
const investmentOutput = document.querySelector("[data-investment-output]");
const modelResult = document.querySelector("[data-model-result]");
const models = [
  {
    max: 12,
    name: "Mini Pocket Cafe",
    text: "Lean 300+ sqft setup for focused locations, colleges, and high-footfall streets.",
  },
  {
    max: 17,
    name: "Pocket Cafe",
    text: "Compact 500+ sqft street or college-facing outlet with fast menu execution.",
  },
  {
    max: 22,
    name: "Cafe Model",
    text: "A complete 1000+ sqft cafe experience for commercial complexes and malls.",
  },
  {
    max: 25,
    name: "Tea Smokers Neo",
    text: "Premium 1200+ sqft flagship format for prime city markets and larger seating.",
  },
];

function updateModel() {
  const value = Number(range.value);
  const model = models.find((item) => value <= item.max) || models[models.length - 1];

  investmentOutput.textContent = `Rs ${value} Lakh`;
  modelResult.querySelector("h3").textContent = model.name;
  modelResult.querySelector("p").textContent = model.text;
}

range.addEventListener("input", updateModel);
updateModel();

const inquiryForm = document.querySelector("[data-inquiry-form]");
inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(inquiryForm);
  const message = [
    "Hello Tea Smokers Team,",
    "",
    "I want to discuss a franchise opportunity.",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `City: ${data.get("city")}`,
    `Preferred format: ${data.get("format")}`,
  ].join("\n");

  window.open(`https://wa.me/919695260112?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  });
});
