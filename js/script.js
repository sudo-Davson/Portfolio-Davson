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
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("in-view"));
    } else {
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
        const msg =
          form?.dataset.i18nError ||
          "Merci de compl\\u00E9ter tous les champs correctement avant d'envoyer.";
        setFeedback("error", msg);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent || "";
        submitBtn.textContent = "Envoi en cours...";
      }

      const sendingMsg =
        form?.dataset.i18nSending || "Envoi de votre message en cours...";
      setFeedback("info", sendingMsg);

      setTimeout(() => {
        try {
          form.submit();
        } catch (error) {
          const failedMsg =
            form?.dataset.i18nFailed ||
            "Impossible d'envoyer le message pour le moment. R\\u00E9essayez dans quelques instants.";
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
      nav_about: "\\u00C0 propos",
      nav_contact: "Contact",
      nav_language_label: "Langue",
      nav_menu_label: "Ouvrir le menu",
      hero_portfolio: "Portfolio",
      hero_alias: "alias Davson",
      hero_role_line: "D\\u00E9veloppeur Full Stack & Designer de Solutions Graphiques",
      hero_desc:
        "Je suis d\\u00E9veloppeur et designer sp\\u00E9cialis\\u00E9 dans la cr\\u00E9ation de solutions web et mobiles modernes, performantes et visuellement impactantes.",
      hero_cta_primary: "Voir mes travaux",
      hero_cta_secondary: "Discutons de votre projet",
      hero_availability_label: "Disponibilit\\u00E9",
      hero_availability_title: "Nouveaux projets",
      hero_availability_note: "Ouvert pour avril 2026",
      hero_focus_label: "Focus",
      hero_focus_title: "Design & Dev",
      hero_focus_note: "Sites, dashboards, branding",
      hero_stack_label: "Stack",
      hero_stack_title: "Web moderne",
      hero_stack_note: "JS, Tailwind, Webflow",
      hero_support_label: "Support",
      hero_support_title: "Partenariat",
      hero_support_note: "Du brief \\u00E0 la mise en ligne",
      services_title: "Services",
      services_subtitle:
        "Des solutions compl\\u00E8tes pour vous aider \\u00E0 cr\\u00E9er une pr\\u00E9sence digitale coh\\u00E9rente et m\\u00E9morable.",
      services_dev_title: "D\\u00E9veloppement web et Application mobile",
      services_dev_desc:
        "Sites vitrines, landing pages et dashboards performants avec un code propre et maintenable.",
      services_dev_tag: "Front-end & Int\\u00E9gration",
      services_ui_title: "Design UI/UX",
      services_ui_desc:
        "Interfaces centr\\u00E9es utilisateur, prototypes interactifs et syst\\u00E8mes de design \\u00E9volutifs.",
      services_ui_tag: "Wireframes & Design System",
      services_brand_title: "Branding",
      services_brand_desc:
        "Identit\\u00E9s visuelles compl\\u00E8tes : logos, chartes graphiques et supports marketing premium.",
      services_brand_tag: "Logo & Identit\\u00E9",
      portfolio_title: "Portfolio",
      portfolio_subtitle:
        "Une s\\u00E9lection de projets r\\u00E9cents pour illustrer l'univers visuel et les expertises propos\\u00E9es.",
      portfolio_dev_title: "Projet d\\u00E9veloppement d'application",
      portfolio_dev_label: "Dev",
      portfolio_design_title: "Projet design",
      portfolio_design_label: "Design",
      portfolio_video_title: "Projet montage vid\\u00E9o",
      portfolio_video_label: "Vid\\u00E9o",
      portfolio_dev1_title: "Soci\\u00E9t\\u00E9 Ngody",
      portfolio_design1_title: "Mockup Produit",
      portfolio_design2_title: "Logo Sonia",
      portfolio_design3_title: "Affiche Locks Pro",
      portfolio_design4_title: "\\u00C9tiquette Ebesse Fionfion",
      portfolio_design5_title: "Logo Creatif",
      portfolio_video1_title: "Colonie",
      portfolio_dev1_desc: "Projet web r\\u00E9cent : vitrine moderne et responsive.",
      portfolio_dev1_link: "Voir le site",
      portfolio_design1_desc: "Pr\\u00E9sentation visuelle et mise en contexte premium.",
      portfolio_design2_desc: "Identit\\u00E9 graphique \\u00E9l\\u00E9gante et m\\u00E9morable.",
      portfolio_design3_desc: "Affiche impactante avec hi\\u00E9rarchie claire.",
      portfolio_design4_desc: "Packaging et mise en avant de marque.",
      portfolio_design5_desc: "Cr\\u00E9ation de logo Pour Chorale",
      portfolio_video1_desc: "Montage vid\\u00E9o",
      portfolio_video_fallback: "Votre navigateur ne supporte pas la lecture vid\\u00E9o.",
      portfolio_video_empty:
        "Les projets de montage vid\\u00E9o seront ajout\\u00E9s ici prochainement.",
      about_badge: "D\\u00E9veloppeur & Designer de Solutions Digitales",
      about_location: "Bas\\u00E9 \\u00E0 Lom\\u00E9 - Togo",
      about_title: "\\u00C0 propos",
      about_p1:
        "Je suis d\\u00E9veloppeur et designer sp\\u00E9cialis\\u00E9 dans la cr\\u00E9ation de solutions web et mobiles modernes, performantes et visuellement impactantes.",
      about_p2:
        "J'accompagne les entreprises et les entrepreneurs dans la digitalisation de leurs activit\\u00E9s, en concevant des produits qui allient technologie, design et efficacit\\u00E9. Mon objectif est simple : transformer vos id\\u00E9es en solutions concr\\u00E8tes, utiles et rentables.",
      about_p3:
        "Gr\\u00E2ce \\u00E0 une ma\\u00EEtrise de technologies comme Python, JavaScript, PHP, Java et Flutter, je d\\u00E9veloppe des syst\\u00E8mes complets, de la conception technique jusqu'\\u00E0 l'exp\\u00E9rience utilisateur.",
      about_p4:
        "Mais au-del\\u00E0 du d\\u00E9veloppement, je porte une attention particuli\\u00E8re au design et \\u00E0 l'exp\\u00E9rience utilisateur (UI/UX).",
      about_ui_title: "Chaque interface est",
      about_ui_1: "Moderne",
      about_ui_2: "Intuitive",
      about_ui_3: "Rapide",
      about_ui_4: "Adapt\\u00E9e aux utilisateurs r\\u00E9els",
      about_build_title: "Ce que je con\\u00E7ois",
      about_build_1: "Applications web sur mesure",
      about_build_2: "Plateformes digitales (marketplace, outils de gestion)",
      about_build_3: "Applications mobiles performantes",
      about_build_4: "Interfaces UI/UX modernes et professionnelles",
      about_build_5: "Syst\\u00E8mes d'automatisation pour optimiser les activit\\u00E9s",
      about_diff_title: "Ce qui me diff\\u00E9rencie",
      about_diff_1: "Double comp\\u00E9tence d\\u00E9veloppement + design",
      about_diff_2: "Approche centr\\u00E9e sur l'utilisateur et les r\\u00E9sultats",
      about_diff_3: "Solutions adapt\\u00E9es aux r\\u00E9alit\\u00E9s africaines",
      about_diff_4: "Attention aux d\\u00E9tails visuels et \\u00E0 la performance",
      about_diff_5: "Capacit\\u00E9 \\u00E0 transformer une id\\u00E9e en produit complet",
      about_skills_title: "Comp\\u00E9tences cl\\u00E9s",
      about_tools_title: "Outils ma\\u00EEtris\\u00E9s",
      contact_title: "Contact",
      contact_subtitle:
        "Un projet en t\\u00EAte ? Parlons-en et construisons ensemble une solution sur-mesure.",
      contact_info_title: "Disponibilit\\u00E9 & infos",
      contact_info_desc:
        "Lom\\u00E9 - Togo \\u00B7 Disponible pour missions freelance et collaborations long terme.",
      contact_email_label_info: "Email :",
      contact_phone_label: "T\\u00E9l\\u00E9phone :",
      contact_location_label: "Localisation :",
      contact_whatsapp: "WhatsApp direct",
      contact_form_title: "Envoyer un message",
      contact_name_label: "Nom complet",
      contact_name_placeholder: "Votre nom",
      contact_email_label: "Email",
      contact_email_placeholder: "votre@email.com",
      contact_message_label: "Message",
      contact_message_placeholder: "Parlez-moi de votre projet...",
      contact_send: "Envoyer",
      footer_tagline: "D\\u00E9veloppeur FullStack & Designer Graphique",
      footer_rights: "Tous droits r\\u00E9serv\\u00E9s.",
      back_to_top: "Revenir en haut",
      form_error: "Merci de compl\\u00E9ter tous les champs correctement avant d'envoyer.",
      form_sending: "Envoi de votre message en cours...",
      form_failed:
        "Impossible d'envoyer le message pour le moment. R\\u00E9essayez dans quelques instants.",
    },
    en: {
      nav_home: "Home",
      nav_services: "Services",
      nav_portfolio: "Portfolio",
      nav_about: "About",
      nav_contact: "Contact",
      nav_language_label: "Language",
      nav_menu_label: "Open menu",
      hero_portfolio: "Portfolio",
      hero_alias: "aka Davson",
      hero_role_line: "Full Stack Developer & Digital Solutions Designer",
      hero_desc:
        "I design and build modern web and mobile solutions that are fast, clean, and visually impactful.",
      hero_cta_primary: "View my work",
      hero_cta_secondary: "Let's talk about your project",
      hero_availability_label: "Availability",
      hero_availability_title: "New projects",
      hero_availability_note: "Open for April 2026",
      hero_focus_label: "Focus",
      hero_focus_title: "Design & Dev",
      hero_focus_note: "Sites, dashboards, branding",
      hero_stack_label: "Stack",
      hero_stack_title: "Modern web",
      hero_stack_note: "JS, Tailwind, Webflow",
      hero_support_label: "Support",
      hero_support_title: "Partnership",
      hero_support_note: "From brief to launch",
      services_title: "Services",
      services_subtitle:
        "Complete solutions to help you build a consistent and memorable digital presence.",
      services_dev_title: "Web development and Mobile apps",
      services_dev_desc:
        "Showcase sites, landing pages, and dashboards with clean, maintainable code.",
      services_dev_tag: "Front-end & Integration",
      services_ui_title: "UI/UX Design",
      services_ui_desc:
        "User-centered interfaces, interactive prototypes, and scalable design systems.",
      services_ui_tag: "Wireframes & Design System",
      services_brand_title: "Branding",
      services_brand_desc:
        "Complete visual identities: logos, brand guidelines, and premium marketing assets.",
      services_brand_tag: "Logo & Identity",
      portfolio_title: "Portfolio",
      portfolio_subtitle:
        "A selection of recent projects showcasing visual direction and expertise.",
      portfolio_dev_title: "App development projects",
      portfolio_dev_label: "Dev",
      portfolio_design_title: "Design projects",
      portfolio_design_label: "Design",
      portfolio_video_title: "Video editing projects",
      portfolio_video_label: "Video",
      portfolio_dev1_title: "Soci\\u00E9t\\u00E9 Ngody",
      portfolio_design1_title: "Product Mockup",
      portfolio_design2_title: "Sonia Logo",
      portfolio_design3_title: "Locks Pro Poster",
      portfolio_design4_title: "Ebesse Fionfion Label",
      portfolio_design5_title: "Creative Logo",
      portfolio_video1_title: "Colony",
      portfolio_dev1_desc: "Recent web project: modern responsive showcase site.",
      portfolio_dev1_link: "View site",
      portfolio_design1_desc: "Premium visual presentation and mockup showcase.",
      portfolio_design2_desc: "Elegant and memorable visual identity.",
      portfolio_design3_desc: "Impactful poster with clear hierarchy.",
      portfolio_design4_desc: "Packaging and brand emphasis.",
      portfolio_design5_desc: "Logo creation for a choir.",
      portfolio_video1_desc: "Video editing",
      portfolio_video_fallback: "Your browser does not support video playback.",
      portfolio_video_empty: "Video editing projects will be added soon.",
      about_badge: "Developer & Digital Solutions Designer",
      about_location: "Based in Lom\\u00E9 - Togo",
      about_title: "About",
      about_p1:
        "I design and build modern web and mobile solutions that are fast and visually impactful.",
      about_p2:
        "I help companies and entrepreneurs digitize their activities by building products that blend technology, design, and efficiency. My goal is simple: turn ideas into concrete, useful, profitable solutions.",
      about_p3:
        "With strong skills in Python, JavaScript, PHP, Java, and Flutter, I deliver complete systems from technical design to user experience.",
      about_p4:
        "Beyond development, I pay close attention to design and user experience (UI/UX).",
      about_ui_title: "Every interface is",
      about_ui_1: "Modern",
      about_ui_2: "Intuitive",
      about_ui_3: "Fast",
      about_ui_4: "Built for real users",
      about_build_title: "What I build",
      about_build_1: "Custom web applications",
      about_build_2: "Digital platforms (marketplace, management tools)",
      about_build_3: "High-performance mobile apps",
      about_build_4: "Modern professional UI/UX interfaces",
      about_build_5: "Automation systems to optimize operations",
      about_diff_title: "What sets me apart",
      about_diff_1: "Dual skillset: development + design",
      about_diff_2: "User- and results-driven approach",
      about_diff_3: "Solutions adapted to African realities",
      about_diff_4: "Attention to visual detail and performance",
      about_diff_5: "Ability to turn an idea into a complete product",
      about_skills_title: "Key skills",
      about_tools_title: "Tools",
      contact_title: "Contact",
      contact_subtitle:
        "Have a project in mind? Let's talk and build a tailored solution together.",
      contact_info_title: "Availability & info",
      contact_info_desc: "Lom\\u00E9 - Togo \\u00B7 Available for freelance and long-term work.",
      contact_email_label_info: "Email:",
      contact_phone_label: "Phone:",
      contact_location_label: "Location:",
      contact_whatsapp: "WhatsApp",
      contact_form_title: "Send a message",
      contact_name_label: "Full name",
      contact_name_placeholder: "Your name",
      contact_email_label: "Email",
      contact_email_placeholder: "your@email.com",
      contact_message_label: "Message",
      contact_message_placeholder: "Tell me about your project...",
      contact_send: "Send",
      footer_tagline: "Full Stack Developer & Graphic Designer",
      footer_rights: "All rights reserved.",
      back_to_top: "Back to top",
      form_error: "Please complete all fields correctly before sending.",
      form_sending: "Sending your message...",
      form_failed:
        "Unable to send your message right now. Please try again in a moment.",
    },
    es: {
      nav_home: "Inicio",
      nav_services: "Servicios",
      nav_portfolio: "Portafolio",
      nav_about: "Sobre m\\u00ED",
      nav_contact: "Contacto",
      nav_language_label: "Idioma",
      nav_menu_label: "Abrir men\\u00FA",
      hero_portfolio: "Portafolio",
      hero_alias: "alias Davson",
      hero_role_line: "Desarrollador Full Stack y Dise\\u00F1ador de Soluciones Digitales",
      hero_desc:
        "Creo soluciones web y m\\u00F3viles modernas, r\\u00E1pidas y visualmente impactantes.",
      hero_cta_primary: "Ver mis trabajos",
      hero_cta_secondary: "Hablemos de tu proyecto",
      hero_availability_label: "Disponibilidad",
      hero_availability_title: "Nuevos proyectos",
      hero_availability_note: "Disponible para abril 2026",
      hero_focus_label: "Enfoque",
      hero_focus_title: "Dise\\u00F1o y Dev",
      hero_focus_note: "Sitios, dashboards, branding",
      hero_stack_label: "Stack",
      hero_stack_title: "Web moderna",
      hero_stack_note: "JS, Tailwind, Webflow",
      hero_support_label: "Soporte",
      hero_support_title: "Colaboraci\\u00F3n",
      hero_support_note: "Del brief al lanzamiento",
      services_title: "Servicios",
      services_subtitle:
        "Soluciones completas para ayudarte a construir una presencia digital coherente y memorable.",
      services_dev_title: "Desarrollo web y apps m\\u00F3viles",
      services_dev_desc:
        "Sitios vitrina, landing pages y dashboards con c\\u00F3digo limpio y mantenible.",
      services_dev_tag: "Front-end e Integraci\\u00F3n",
      services_ui_title: "Dise\\u00F1o UI/UX",
      services_ui_desc:
        "Interfaces centradas en el usuario, prototipos interactivos y sistemas escalables.",
      services_ui_tag: "Wireframes y Design System",
      services_brand_title: "Branding",
      services_brand_desc:
        "Identidades visuales completas: logos, gu\\u00EDas y recursos premium.",
      services_brand_tag: "Logo e Identidad",
      portfolio_title: "Portafolio",
      portfolio_subtitle:
        "Una selecci\\u00F3n de proyectos recientes que muestran la direcci\\u00F3n visual y la experiencia.",
      portfolio_dev_title: "Proyectos de desarrollo",
      portfolio_dev_label: "Dev",
      portfolio_design_title: "Proyectos de dise\\u00F1o",
      portfolio_design_label: "Dise\\u00F1o",
      portfolio_video_title: "Proyectos de edici\\u00F3n de video",
      portfolio_video_label: "Video",
      portfolio_dev1_title: "Soci\\u00E9t\\u00E9 Ngody",
      portfolio_design1_title: "Mockup de Producto",
      portfolio_design2_title: "Logo Sonia",
      portfolio_design3_title: "Cartel Locks Pro",
      portfolio_design4_title: "Etiqueta Ebesse Fionfion",
      portfolio_design5_title: "Logo Creativo",
      portfolio_video1_title: "Colonia",
      portfolio_dev1_desc: "Proyecto web reciente: vitrina moderna y responsive.",
      portfolio_dev1_link: "Ver sitio",
      portfolio_design1_desc: "Presentaci\\u00F3n visual y mockup premium.",
      portfolio_design2_desc: "Identidad gr\\u00E1fica elegante y memorable.",
      portfolio_design3_desc: "Afiche impactante con jerarqu\\u00EDa clara.",
      portfolio_design4_desc: "Packaging y realce de marca.",
      portfolio_design5_desc: "Creaci\\u00F3n de logo para coro.",
      portfolio_video1_desc: "Edici\\u00F3n de video",
      portfolio_video_fallback: "Tu navegador no soporta la reproducci\\u00F3n de video.",
      portfolio_video_empty: "Los proyectos de edici\\u00F3n de video se a\\u00F1adir\\u00E1n pronto.",
      about_badge: "Desarrollador y Dise\\u00F1ador de Soluciones Digitales",
      about_location: "Con base en Lom\\u00E9 - Togo",
      about_title: "Sobre m\\u00ED",
      about_p1:
        "Soy desarrollador y dise\\u00F1ador especializado en soluciones web y m\\u00F3viles modernas, r\\u00E1pidas e impactantes.",
      about_p2:
        "Ayudo a empresas y emprendedores a digitalizar sus actividades, creando productos que combinan tecnolog\\u00EDa, dise\\u00F1o y eficiencia.",
      about_p3:
        "Con dominio de Python, JavaScript, PHP, Java y Flutter, desarrollo sistemas completos desde la concepci\\u00F3n t\\u00E9cnica hasta la experiencia de usuario.",
      about_p4:
        "M\\u00E1s all\\u00E1 del desarrollo, cuido el dise\\u00F1o y la experiencia de usuario (UI/UX).",
      about_ui_title: "Cada interfaz es",
      about_ui_1: "Moderna",
      about_ui_2: "Intuitiva",
      about_ui_3: "R\\u00E1pida",
      about_ui_4: "Adaptada a usuarios reales",
      about_build_title: "Lo que dise\\u00F1o",
      about_build_1: "Aplicaciones web a medida",
      about_build_2: "Plataformas digitales (marketplace, gesti\\u00F3n)",
      about_build_3: "Apps m\\u00F3viles de alto rendimiento",
      about_build_4: "Interfaces UI/UX modernas y profesionales",
      about_build_5: "Sistemas de automatizaci\\u00F3n para optimizar actividades",
      about_diff_title: "Lo que me diferencia",
      about_diff_1: "Doble competencia: desarrollo + dise\\u00F1o",
      about_diff_2: "Enfoque centrado en el usuario y resultados",
      about_diff_3: "Soluciones adaptadas a realidades africanas",
      about_diff_4: "Atenci\\u00F3n al detalle visual y rendimiento",
      about_diff_5: "Capacidad de convertir una idea en producto completo",
      about_skills_title: "Habilidades clave",
      about_tools_title: "Herramientas",
      contact_title: "Contacto",
      contact_subtitle:
        "\\u00BFTienes un proyecto? Hablemos y construyamos una soluci\\u00F3n a medida.",
      contact_info_title: "Disponibilidad y info",
      contact_info_desc: "Lom\\u00E9 - Togo \\u00B7 Disponible para freelance y colaboraciones.",
      contact_email_label_info: "Email:",
      contact_phone_label: "Tel\\u00E9fono:",
      contact_location_label: "Ubicaci\\u00F3n:",
      contact_whatsapp: "WhatsApp",
      contact_form_title: "Enviar un mensaje",
      contact_name_label: "Nombre completo",
      contact_name_placeholder: "Tu nombre",
      contact_email_label: "Correo",
      contact_email_placeholder: "tu@correo.com",
      contact_message_label: "Mensaje",
      contact_message_placeholder: "Cu\\u00E9ntame sobre tu proyecto...",
      contact_send: "Enviar",
      footer_tagline: "Desarrollador Full Stack y Dise\\u00F1ador Gr\\u00E1fico",
      footer_rights: "Todos los derechos reservados.",
      back_to_top: "Volver arriba",
      form_error: "Completa correctamente todos los campos antes de enviar.",
      form_sending: "Enviando tu mensaje...",
      form_failed:
        "No se pudo enviar el mensaje. Int\\u00E9ntalo de nuevo en unos instantes.",
    },
    pt: {
      nav_home: "In\\u00EDcio",
      nav_services: "Servi\\u00E7os",
      nav_portfolio: "Portf\\u00F3lio",
      nav_about: "Sobre",
      nav_contact: "Contato",
      nav_language_label: "Idioma",
      nav_menu_label: "Abrir menu",
      hero_portfolio: "Portf\\u00F3lio",
      hero_alias: "alias Davson",
      hero_role_line: "Desenvolvedor Full Stack & Designer de Solu\\u00E7\\u00F5es Digitais",
      hero_desc:
        "Crio solu\\u00E7\\u00F5es web e mobile modernas, r\\u00E1pidas e visualmente impactantes.",
      hero_cta_primary: "Ver meus trabalhos",
      hero_cta_secondary: "Vamos falar do seu projeto",
      hero_availability_label: "Disponibilidade",
      hero_availability_title: "Novos projetos",
      hero_availability_note: "Dispon\\u00EDvel para abril de 2026",
      hero_focus_label: "Foco",
      hero_focus_title: "Design & Dev",
      hero_focus_note: "Sites, dashboards, branding",
      hero_stack_label: "Stack",
      hero_stack_title: "Web moderna",
      hero_stack_note: "JS, Tailwind, Webflow",
      hero_support_label: "Suporte",
      hero_support_title: "Parceria",
      hero_support_note: "Do briefing ao lan\\u00E7amento",
      services_title: "Servi\\u00E7os",
      services_subtitle:
        "Solu\\u00E7\\u00F5es completas para ajudar voc\\u00EA a construir uma presen\\u00E7a digital coerente e memor\\u00E1vel.",
      services_dev_title: "Desenvolvimento web e apps m\\u00F3veis",
      services_dev_desc:
        "Sites institucionais, landing pages e dashboards com c\\u00F3digo limpo e sustent\\u00E1vel.",
      services_dev_tag: "Front-end & Integra\\u00E7\\u00E3o",
      services_ui_title: "Design UI/UX",
      services_ui_desc:
        "Interfaces centradas no usu\\u00E1rio, prot\\u00F3tipos interativos e sistemas escal\\u00E1veis.",
      services_ui_tag: "Wireframes & Design System",
      services_brand_title: "Branding",
      services_brand_desc:
        "Identidades visuais completas: logotipos, guias e materiais premium.",
      services_brand_tag: "Logo & Identidade",
      portfolio_title: "Portf\\u00F3lio",
      portfolio_subtitle:
        "Uma sele\\u00E7\\u00E3o de projetos recentes que mostram dire\\u00E7\\u00E3o visual e expertise.",
      portfolio_dev_title: "Projetos de desenvolvimento",
      portfolio_dev_label: "Dev",
      portfolio_design_title: "Projetos de design",
      portfolio_design_label: "Design",
      portfolio_video_title: "Projetos de edi\\u00E7\\u00E3o de v\\u00EDdeo",
      portfolio_video_label: "V\\u00EDdeo",
      portfolio_dev1_title: "Soci\\u00E9t\\u00E9 Ngody",
      portfolio_design1_title: "Mockup de Produto",
      portfolio_design2_title: "Logo Sonia",
      portfolio_design3_title: "Cartaz Locks Pro",
      portfolio_design4_title: "Etiqueta Ebesse Fionfion",
      portfolio_design5_title: "Logo Criativo",
      portfolio_video1_title: "Col\\u00F4nia",
      portfolio_dev1_desc: "Projeto web recente: vitrine moderna e responsiva.",
      portfolio_dev1_link: "Ver site",
      portfolio_design1_desc: "Apresenta\\u00E7\\u00E3o visual e mockup premium.",
      portfolio_design2_desc: "Identidade visual elegante e memor\\u00E1vel.",
      portfolio_design3_desc: "Cartaz impactante com hierarquia clara.",
      portfolio_design4_desc: "Embalagem e destaque de marca.",
      portfolio_design5_desc: "Cria\\u00E7\\u00E3o de logo para coral.",
      portfolio_video1_desc: "Edi\\u00E7\\u00E3o de v\\u00EDdeo",
      portfolio_video_fallback: "Seu navegador n\\u00E3o suporta reprodu\\u00E7\\u00E3o de v\\u00EDdeo.",
      portfolio_video_empty: "Os projetos de edi\\u00E7\\u00E3o de v\\u00EDdeo ser\\u00E3o adicionados em breve.",
      about_badge: "Desenvolvedor & Designer de Solu\\u00E7\\u00F5es Digitais",
      about_location: "Baseado em Lom\\u00E9 - Togo",
      about_title: "Sobre",
      about_p1:
        "Sou desenvolvedor e designer especializado em solu\\u00E7\\u00F5es web e mobile modernas e impactantes.",
      about_p2:
        "Acompanho empresas e empreendedores na digitaliza\\u00E7\\u00E3o, criando produtos que unem tecnologia, design e efici\\u00EAncia.",
      about_p3:
        "Domino Python, JavaScript, PHP, Java e Flutter para entregar sistemas completos do design t\\u00E9cnico \\u00E0 experi\\u00EAncia do usu\\u00E1rio.",
      about_p4:
        "Al\\u00E9m do desenvolvimento, cuido do design e da experi\\u00EAncia do usu\\u00E1rio (UI/UX).",
      about_ui_title: "Cada interface \\u00E9",
      about_ui_1: "Moderna",
      about_ui_2: "Intuitiva",
      about_ui_3: "R\\u00E1pida",
      about_ui_4: "Adaptada a usu\\u00E1rios reais",
      about_build_title: "O que eu construo",
      about_build_1: "Aplica\\u00E7\\u00F5es web sob medida",
      about_build_2: "Plataformas digitais (marketplace, gest\\u00E3o)",
      about_build_3: "Apps m\\u00F3veis de alta performance",
      about_build_4: "Interfaces UI/UX modernas e profissionais",
      about_build_5: "Sistemas de automa\\u00E7\\u00E3o para otimizar atividades",
      about_diff_title: "O que me diferencia",
      about_diff_1: "Dupla compet\\u00EAncia: desenvolvimento + design",
      about_diff_2: "Abordagem centrada no usu\\u00E1rio e resultados",
      about_diff_3: "Solu\\u00E7\\u00F5es adaptadas \\u00E0s realidades africanas",
      about_diff_4: "Aten\\u00E7\\u00E3o aos detalhes visuais e performance",
      about_diff_5: "Capacidade de transformar uma ideia em produto completo",
      about_skills_title: "Compet\\u00EAncias-chave",
      about_tools_title: "Ferramentas",
      contact_title: "Contato",
      contact_subtitle:
        "Tem um projeto em mente? Vamos conversar e criar uma solu\\u00E7\\u00E3o sob medida.",
      contact_info_title: "Disponibilidade e info",
      contact_info_desc: "Lom\\u00E9 - Togo \\u00B7 Dispon\\u00EDvel para freelance e longo prazo.",
      contact_email_label_info: "Email:",
      contact_phone_label: "Telefone:",
      contact_location_label: "Localiza\\u00E7\\u00E3o:",
      contact_whatsapp: "WhatsApp",
      contact_form_title: "Enviar uma mensagem",
      contact_name_label: "Nome completo",
      contact_name_placeholder: "Seu nome",
      contact_email_label: "Email",
      contact_email_placeholder: "seu@email.com",
      contact_message_label: "Mensagem",
      contact_message_placeholder: "Conte sobre seu projeto...",
      contact_send: "Enviar",
      footer_tagline: "Desenvolvedor Full Stack & Designer Gr\\u00E1fico",
      footer_rights: "Todos os direitos reservados.",
      back_to_top: "Voltar ao topo",
      form_error: "Preencha todos os campos corretamente antes de enviar.",
      form_sending: "Enviando sua mensagem...",
      form_failed:
        "N\\u00E3o foi poss\\u00EDvel enviar a mensagem agora. Tente novamente em instantes.",
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

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      if (dict[key]) {
        el.setAttribute("aria-label", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (dict[key]) {
        el.setAttribute("data-title", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-description]").forEach((el) => {
      const key = el.dataset.i18nDescription;
      if (dict[key]) {
        el.setAttribute("data-description", dict[key]);
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










