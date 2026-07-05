const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const projectGrid = document.querySelector("#project-grid");
const filters = document.querySelectorAll(".filter");
const contactForm = document.querySelector("#contact-form");
const contactEmail = document.querySelector(".contact-email");
const formStatus = document.querySelector("#form-status");

const escapeHTML = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const projectCard = (project, index) => `
  <article class="project-card reveal is-visible" data-category="${escapeHTML(project.category)}">
    <div class="project-meta">
      <span>${String(index + 1).padStart(2, "0")} / ${escapeHTML(project.type)}</span>
      <span>${escapeHTML(project.location)}</span>
    </div>
    <h3>${escapeHTML(project.name)}</h3>
    <p>${escapeHTML(project.description)}</p>
    <span class="project-material">${escapeHTML(project.material)}</span>
  </article>
`;

const renderProjects = async () => {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("Project data could not be loaded.");
    const projects = await response.json();
    projectGrid.innerHTML = projects.map(projectCard).join("");
  } catch (error) {
    projectGrid.innerHTML = `<p class="project-error">${escapeHTML(error.message)}</p>`;
  }
};

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;
    filters.forEach((button) => button.classList.toggle("is-active", button === filter));
    projectGrid.querySelectorAll(".project-card").forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const destination = contactEmail.getAttribute("href").replace("mailto:", "");

  if (!destination || destination.includes("YOUR_EMAIL")) {
    formStatus.textContent = "Add the HRS email address in index.html to activate this form.";
    return;
  }

  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Website inquiry from ${data.get("name")}`);
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\n` +
    `Email: ${data.get("email")}\n` +
    `Project location: ${data.get("location") || "Not provided"}\n\n` +
    `${data.get("message")}`
  );
  window.location.href = `mailto:${destination}?subject=${subject}&body=${body}`;
  formStatus.textContent = "Your email application should open with the inquiry prepared.";
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderProjects();
