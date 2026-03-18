// Portfolio interactions: menu, reveal animations, form validation, lightbox
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enabled");
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

  const setFeedback = (type, message) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.add("form-alert");
    feedback.classList.remove(
      "form-alert--info",
      "form-alert--success",
      "form-alert--error"
    );
    if (type === "success") {
      feedback.classList.add("form-alert--success");
      return;
    }
    if (type === "error") {
      feedback.classList.add("form-alert--error");
      return;
    }
    feedback.classList.add("form-alert--info");
  };

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
        setFeedback(
          "error",
          "Merci de compléter tous les champs correctement avant d'envoyer."
        );
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent || "";
        submitBtn.textContent = "Envoi en cours...";
      }

      setFeedback("info", "Envoi de votre message en cours...");

      setTimeout(() => {
        try {
          form.submit();
        } catch (error) {
          setFeedback(
            "error",
            "Impossible d'envoyer le message pour le moment. Réessayez dans quelques instants."
          );
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || "Envoyer";
          }
        }
      }, 150);
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
  };  const openTranslateFallback = (lang) => {
    if (!lang || lang === "fr") return;
    const url = `https://translate.google.com/translate?sl=fr&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener");
  };


  if (languageSelects.length > 0) {
    languageSelects.forEach((select) => {
      select.addEventListener("change", (event) => {
        const lang = event.target.value;
        syncLanguageSelects(lang);
        if (!applyLanguage(lang)) {\n        pendingLanguage = lang;\n        openTranslateFallback(lang);\n      }
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
      } else if (++attempts > 40) {\n        if (pendingLanguage) {\n          openTranslateFallback(pendingLanguage);\n          pendingLanguage = null;\n        }\n        clearInterval(waitForTranslate);\n      }
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


