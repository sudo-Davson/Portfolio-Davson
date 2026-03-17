// Portfolio interactions: menu, reveal animations, form validation, lightbox
window.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

  // Fade-in on scroll
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // Lightbox
  if (window.GLightbox) {
    window.GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
    });
  }

  // Contact form validation + send
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const submitBtn = form?.querySelector("button[type=\"submit\"]") || null;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    message: document.getElementById("message"),
  };

  const setFieldState = (field, isValid) => {
    if (!field) return;
    field.classList.remove("input-error", "input-success");
    field.classList.add(isValid ? "input-success" : "input-error");
  };

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      let isFormValid = true;

      if (!fields.name?.value.trim()) {
        setFieldState(fields.name, false);
        isFormValid = false;
      } else {
        setFieldState(fields.name, true);
      }

      if (!fields.email?.value.trim() || !isValidEmail(fields.email.value)) {
        setFieldState(fields.email, false);
        isFormValid = false;
      } else {
        setFieldState(fields.email, true);
      }

      if (!fields.message?.value.trim()) {
        setFieldState(fields.message, false);
        isFormValid = false;
      } else {
        setFieldState(fields.message, true);
      }

      if (!feedback) return;

      if (!isFormValid) {
        feedback.textContent =
          "Veuillez compléter tous les champs correctement avant d'envoyer.";
        feedback.classList.remove("text-emerald-300");
        feedback.classList.add("text-red-300");
        return;
      }

      const rawEndpoint = form.dataset.endpoint?.trim();
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const endpoint = rawEndpoint
        ? (isLocalhost
            ? rawEndpoint
            : rawEndpoint.includes("localhost") || rawEndpoint.includes("127.0.0.1")
              ? "/api/contact"
              : rawEndpoint)
        : isLocalhost
          ? "http://localhost:3000/api/contact"
          : "/api/contact";

      const payload = {
        name: fields.name?.value.trim(),
        email: fields.email?.value.trim(),
        message: fields.message?.value.trim(),
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent || "";
        submitBtn.textContent = "Envoi en cours...";
      }

      feedback.textContent = "Envoi de votre message...";
      feedback.classList.remove("text-red-300", "text-emerald-300");
      feedback.classList.add("text-slate-300");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de l'envoi.");
        }

        feedback.textContent =
          data.message || "Merci pour votre message ! Je vous réponds très vite.";
        feedback.classList.remove("text-red-300");
        feedback.classList.add("text-emerald-300");
        form.reset();
        Object.values(fields).forEach((field) => {
          if (field) field.classList.remove("input-success");
        });
      } catch (error) {
        const isLocalEndpoint =
          typeof endpoint === "string" &&
          endpoint.includes("localhost") &&
          window.location.hostname !== "localhost";
        feedback.textContent =
          (isLocalEndpoint
            ? "Le serveur de contact n'est pas démarré. Lance le backend puis réessaie."
            : error.message) ||
          "Une erreur est survenue. Veuillez réessayer plus tard.";
        feedback.classList.remove("text-emerald-300");
        feedback.classList.add("text-red-300");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || "Envoyer";
        }
      }
    });
  }
  // Language switcher (Google Translate)
  const languageSelects = document.querySelectorAll(".language-select");
  let pendingLanguage = null;

  const syncLanguageSelects = (lang) => {
    languageSelects.forEach((select) => {
      if (select.value !== lang) {
        select.value = lang;
      }
    });
  };

  const applyLanguage = (lang) => {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return false;
    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
    return true;
  };

  if (languageSelects.length > 0) {
    languageSelects.forEach((select) => {
      select.addEventListener("change", (event) => {
        const lang = event.target.value;
        syncLanguageSelects(lang);
        if (!applyLanguage(lang)) {
          pendingLanguage = lang;
        }
      });
    });

    const onTranslateReady = () => {
      const combo = document.querySelector(".goog-te-combo");
      if (!combo) return;
      if (pendingLanguage) {
        applyLanguage(pendingLanguage);
        pendingLanguage = null;
      }
      syncLanguageSelects(combo.value || "fr");
      combo.addEventListener("change", () => {
        syncLanguageSelects(combo.value || "fr");
      });
    };

    window.addEventListener("google-translate-ready", onTranslateReady, {
      once: true,
    });

    let attempts = 0;
    const waitForTranslate = setInterval(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        onTranslateReady();
        clearInterval(waitForTranslate);
      } else if (++attempts > 40) {
        clearInterval(waitForTranslate);
      }
    }, 500);
  }
  // Back-to-top button
  const backToTop = document.getElementById("back-to-top");
  const toggleBackToTop = () => {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.remove("hidden");
      backToTop.classList.add("flex");
    } else {
      backToTop.classList.add("hidden");
      backToTop.classList.remove("flex");
    }
  };

  if (backToTop) {
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  // Dynamic year
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});












