// ============================================
// CONFIG — update these before you deploy
// ============================================
const CONFIG = {
  linkedInUrl: "https://www.linkedin.com/in/anurag-singh-bba448378",
  instagramUrl: "https://www.instagram.com/_anurag_singh_100",
  // Where the contact form posts to. Points at the local backend by default (see /backend).
  // When you deploy, replace with your live backend URL, e.g. "https://your-api.onrender.com/api/contact"
  contactEndpoint: "http://localhost:4000/api/contact"
};

// ============================================
// NAVBAR
// ============================================
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ============================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================
const revealSelectors = [
  ".reveal-up", ".reveal-left", ".reveal-right", ".reveal-drop",
  ".mv-card", ".exp-card", ".edu-card", ".proj-card",
  ".skill-card", ".cert-grid", ".stat-row", ".about-copy"
];

const revealTargets = document.querySelectorAll(revealSelectors.join(","));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");

      // Trigger skill bar fill when a skill card becomes visible
      if (entry.target.classList.contains("skill-card")) {
        entry.target.querySelectorAll(".skill-row").forEach(row => {
          const val = row.getAttribute("data-v");
          const fill = row.querySelector(".fill");
          requestAnimationFrame(() => { fill.style.width = val + "%"; });
        });
      }

      // Trigger stat counters when the highlights row becomes visible
      if (entry.target.classList.contains("stat-row")) {
        entry.target.querySelectorAll(".stat").forEach(stat => animateCounter(stat));
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealTargets.forEach(el => revealObserver.observe(el));

// About copy container also needs the class for its child .work-link stagger
const aboutCopy = document.querySelector(".about-copy");
if (aboutCopy) revealObserver.observe(aboutCopy);

// ============================================
// COUNT-UP STATS
// ============================================
function animateCounter(statEl) {
  const target = parseFloat(statEl.getAttribute("data-target"));
  const isDecimal = statEl.getAttribute("data-decimal") === "true";
  const numEl = statEl.querySelector(".stat-num");
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    numEl.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
    if (progress < 1) requestAnimationFrame(tick);
    else numEl.textContent = isDecimal ? target.toFixed(2) : target;
  }
  requestAnimationFrame(tick);
}

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector(".btn-send");
  const data = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    subject: contactForm.subject.value.trim(),
    message: contactForm.message.value.trim()
  };

  formStatus.textContent = "Sending…";
  formStatus.className = "form-status";
  submitBtn.disabled = true;

  try {
    const res = await fetch(CONFIG.contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Request failed");

    formStatus.textContent = "Message sent — thanks for reaching out! I'll get back to you soon.";
    formStatus.classList.add("ok");
    contactForm.reset();
    contactForm.classList.add("pulse-once");
    setTimeout(() => contactForm.classList.remove("pulse-once"), 1200);
  } catch (err) {
    formStatus.textContent = "Couldn't send right now — please email me directly at kmtarang7311@gmail.com.";
    formStatus.classList.add("err");
  } finally {
    submitBtn.disabled = false;
  }
});
