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
        const msg = form?.dataset.i18nError ||
          "Merci de compléter tous les champs correctement avant d'envoyer.";
        setFeedback("error", msg);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent || "";
        submitBtn.textContent = "Envoi en cours...";
      }

      const sendingMsg = form?.dataset.i18nSending || "Envoi de votre message en cours...";
      setFeedback("info", sendingMsg);

      setTimeout(() => {
        try {
          form.submit();
        } catch (error) {
          const failedMsg = form?.dataset.i18nFailed ||
            "Impossible d'envoyer le message pour le moment. Réessayez dans quelques instants.";
          setFeedback("error", failedMsg);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || "Envoyer";
          }
        }
      }, 150);
    });
  }

  // Simple language switcher (client-side)
  const languageSelects = document.querySelectorAll(".language-select");
  const defaultLang = document.documentElement.lang || "fr";
  const savedLang = localStorage.getItem("site-lang") || defaultLang;

  const translations = {
    fr: {
      nav_home: "Accueil",
      nav_services: "Services",
      nav_portfolio: "Portfolio",
      nav_about: "À propos",
      nav_contact: "Contact",
      hero_portfolio: "Portfolio",
      hero_alias: "alias Davson",
      hero_role_badge: "Développeur Full Stack",
      hero_role_suffix: "& Designer de Solutions Graphiques",
      hero_tagline: "Développeur & Designer de Solutions Digitales",
      hero_desc:
        "Je suis développeur et designer spécialisé dans la création de solutions web et mobiles modernes, performantes et visuellement impactantes.",
      hero_cta_primary: "Voir mes travaux",
      hero_cta_secondary: "Discutons de votre projet",
      services_title: "Services",
      services_subtitle:
        "Des solutions complètes pour vous aider à créer une présence digitale cohérente et mémorable.",
      contact_title: "Contact",
      contact_subtitle:
        "Un projet en tête ? Parlons-en et construisons ensemble une solution sur-mesure.",
      contact_form_title: "Envoyer un message",
      contact_name_label: "Nom complet",
      contact_name_placeholder: "Votre nom",
      contact_email_label: "Email",
      contact_email_placeholder: "votre@email.com",
      contact_message_label: "Message",
      contact_message_placeholder: "Parlez-moi de votre projet...",
      contact_send: "Envoyer",
      form_error: "Merci de compléter tous les champs correctement avant d'envoyer.",
      form_sending: "Envoi de votre message en cours...",
      form_failed:
        "Impossible d'envoyer le message pour le moment. Réessayez dans quelques instants.",
    },
    en: {
      nav_home: "Home",
      nav_services: "Services",
      nav_portfolio: "Portfolio",
      nav_about: "About",
      nav_contact: "Contact",
      hero_portfolio: "Portfolio",
      hero_alias: "aka Davson",
      hero_role_badge: "Full Stack Developer",
      hero_role_suffix: "& Digital Solutions Designer",
      hero_tagline: "Developer & Digital Solutions Designer",
      hero_desc:
        "I design and build modern web and mobile solutions that are fast, clean, and visually impactful.",
      hero_cta_primary: "View my work",
      hero_cta_secondary: "Let's talk about your project",
      services_title: "Services",
      services_subtitle:
        "Complete solutions to help you build a consistent and memorable digital presence.",
      contact_title: "Contact",
      contact_subtitle:
        "Have a project in mind? Let's talk and build a tailored solution together.",
      contact_form_title: "Send a message",
      contact_name_label: "Full name",
      contact_name_placeholder: "Your name",
      contact_email_label: "Email",
      contact_email_placeholder: "your@email.com",
      contact_message_label: "Message",
      contact_message_placeholder: "Tell me about your project...",
      contact_send: "Send",
      form_error: "Please complete all fields correctly before sending.",
      form_sending: "Sending your message...",
      form_failed:
        "Unable to send your message right now. Please try again in a moment.",
    },
    es: {
      nav_home: "Inicio",
      nav_services: "Servicios",
      nav_portfolio: "Portafolio",
      nav_about: "Sobre mí",
      nav_contact: "Contacto",
      hero_portfolio: "Portafolio",
      hero_alias: "alias Davson",
      hero_role_badge: "Desarrollador Full Stack",
      hero_role_suffix: "y Diseñador de Soluciones Digitales",
      hero_tagline: "Desarrollador y Diseñador de Soluciones Digitales",
      hero_desc:
        "Creo soluciones web y móviles modernas, rápidas y visualmente impactantes.",
      hero_cta_primary: "Ver mis trabajos",
      hero_cta_secondary: "Hablemos de tu proyecto",
      services_title: "Servicios",
      services_subtitle:
        "Soluciones completas para ayudarte a construir una presencia digital coherente y memorable.",
      contact_title: "Contacto",
      contact_subtitle:
        "¿Tienes un proyecto? Hablemos y construyamos una solución a medida.",
      contact_form_title: "Enviar un mensaje",
      contact_name_label: "Nombre completo",
      contact_name_placeholder: "Tu nombre",
      contact_email_label: "Correo",
      contact_email_placeholder: "tu@correo.com",
      contact_message_label: "Mensaje",
      contact_message_placeholder: "Cuéntame sobre tu proyecto...",
      contact_send: "Enviar",
      form_error: "Completa correctamente todos los campos antes de enviar.",
      form_sending: "Enviando tu mensaje...",
      form_failed:
        "No se pudo enviar el mensaje. Inténtalo de nuevo en unos instantes.",
    },
    pt: {
      nav_home: "Início",
      nav_services: "Serviços",
      nav_portfolio: "Portfólio",
      nav_about: "Sobre",
      nav_contact: "Contato",
      hero_portfolio: "Portfólio",
      hero_alias: "alias Davson",
      hero_role_badge: "Desenvolvedor Full Stack",
      hero_role_suffix: "& Designer de Soluções Digitais",
      hero_tagline: "Desenvolvedor & Designer de Soluções Digitais",
      hero_desc:
        "Crio soluções web e mobile modernas, rápidas e visualmente impactantes.",
      hero_cta_primary: "Ver meus trabalhos",
      hero_cta_secondary: "Vamos falar do seu projeto",
      services_title: "Serviços",
      services_subtitle:
        "Soluções completas para ajudar você a construir uma presença digital coerente e memorável.",
      contact_title: "Contato",
      contact_subtitle:
        "Tem um projeto em mente? Vamos conversar e criar uma solução sob medida.",
      contact_form_title: "Enviar uma mensagem",
      contact_name_label: "Nome completo",
      contact_name_placeholder: "Seu nome",
      contact_email_label: "Email",
      contact_email_placeholder: "seu@email.com",
      contact_message_label: "Mensagem",
      contact_message_placeholder: "Conte sobre seu projeto...",
      contact_send: "Enviar",
      form_error: "Preencha todos os campos corretamente antes de enviar.",
      form_sending: "Enviando sua mensagem...",
      form_failed:
        "Não foi possível enviar a mensagem agora. Tente novamente em instantes.",
    },
  };

  const syncLanguageSelects = (lang) => {
    languageSelects.forEach((select) => {
      if (select.value !== lang) {
        select.value = lang;
      }
    });
  };

  const applyTranslations = (lang) => {
    const dict = translations[lang] || translations.fr;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    if (form) {
      form.dataset.i18nError = dict.form_error;
      form.dataset.i18nSending = dict.form_sending;
      form.dataset.i18nFailed = dict.form_failed;
    }
  };

  if (languageSelects.length > 0) {
    languageSelects.forEach((select) => {
      select.addEventListener("change", (event) => {
        const lang = event.target.value;
        localStorage.setItem("site-lang", lang);
        syncLanguageSelects(lang);
        applyTranslations(lang);
      });
    });

    syncLanguageSelects(savedLang);
    applyTranslations(savedLang);
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
