const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const projectGrid = document.querySelector("#project-grid");
const filters = document.querySelectorAll(".filter");
const projectCategoryHeading = document.querySelector("#project-category-heading");
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
    <span class="project-material">${escapeHTML(project.material)} · ${escapeHTML(project.scope)}</span>
  </article>
`;

const categoryLabels = {
  residential: "Residential & mixed-use",
  commercial: "Commercial & hospitality",
  institutional: "Institutional & civic",
  industrial: "Industrial, laboratory & infrastructure"
};

const renderProjects = async () => {
  if (!projectGrid) return;

  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("Project data could not be loaded.");
    const projects = await response.json();
    const limit = Number(projectGrid.dataset.limit || projects.length);

    if (!filters.length) {
      projectGrid.innerHTML = projects.slice(0, limit).map(projectCard).join("");
      return;
    }

    filters.forEach((filter) => {
      const count = projects.filter((project) => project.category === filter.dataset.filter).length;
      filter.insertAdjacentHTML("beforeend", `<span class="filter-count">${count}</span>`);
    });

    const showCategory = (category) => {
      const categoryProjects = projects.filter((project) => project.category === category);
      projectGrid.innerHTML = categoryProjects.map(projectCard).join("");
      projectGrid.setAttribute("aria-labelledby", `tab-${category}`);

      if (projectCategoryHeading) {
        projectCategoryHeading.innerHTML = `
          <p class="eyebrow">Current category</p>
          <h3>${escapeHTML(categoryLabels[category])}</h3>
          <span>${categoryProjects.length} documented projects</span>
        `;
      }

      filters.forEach((button) => {
        const isSelected = button.dataset.filter === category;
        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-selected", String(isSelected));
        button.setAttribute("tabindex", isSelected ? "0" : "-1");
      });
    };

    filters.forEach((filter, filterIndex) => {
      filter.addEventListener("click", () => showCategory(filter.dataset.filter));
      filter.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = filterIndex;
        if (event.key === "ArrowLeft") nextIndex = (filterIndex - 1 + filters.length) % filters.length;
        if (event.key === "ArrowRight") nextIndex = (filterIndex + 1) % filters.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = filters.length - 1;
        filters[nextIndex].focus();
        showCategory(filters[nextIndex].dataset.filter);
      });
    });

    showCategory(document.querySelector(".filter.is-active")?.dataset.filter || "residential");
  } catch (error) {
    projectGrid.innerHTML = `<p class="project-error">${escapeHTML(error.message)}</p>`;
  }
};

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

if (contactForm && contactEmail && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const destination = contactEmail.getAttribute("href").replace("mailto:", "");

    if (!destination || !destination.includes("@")) {
      formStatus.textContent = "Please add a valid HRS email address before using the form.";
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
}

document.querySelectorAll(".year").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

renderProjects();
