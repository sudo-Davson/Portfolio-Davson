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
          "Merci de compléter tous les champs correctement avant d'envoyer.";
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
      nav_language_label: "Langue",
      nav_menu_label: "Ouvrir le menu",
      hero_portfolio: "Portfolio",
      hero_alias: "alias Davson",
      hero_role_line: "Développeur Full Stack & Designer de Solutions Graphiques",
      hero_desc:
        "Je suis développeur et designer spécialisé dans la création de solutions web et mobiles modernes, performantes et visuellement impactantes.",
      hero_cta_primary: "Voir mes travaux",
      hero_cta_secondary: "Discutons de votre projet",
      hero_availability_label: "Disponibilité",
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
      hero_support_note: "Du brief à la mise en ligne",
      services_title: "Services",
      services_subtitle:
        "Des solutions complètes pour vous aider à créer une présence digitale cohérente et mémorable.",
      services_dev_title: "Développement web et Application mobile",
      services_dev_desc:
        "Sites vitrines, landing pages et dashboards performants avec un code propre et maintenable.",
      services_dev_tag: "Front-end & Intégration",
      services_ui_title: "Design UI/UX",
      services_ui_desc:
        "Interfaces centrées utilisateur, prototypes interactifs et systèmes de design évolutifs.",
      services_ui_tag: "Wireframes & Design System",
      services_brand_title: "Branding",
      services_brand_desc:
        "Identités visuelles complètes : logos, chartes graphiques et supports marketing premium.",
      services_brand_tag: "Logo & Identité",
      portfolio_title: "Portfolio",
      portfolio_subtitle:
        "Une sélection de projets récents pour illustrer l'univers visuel et les expertises proposées.",
      portfolio_dev_title: "Projet développement d'application",
      portfolio_dev_label: "Dev",
      portfolio_design_title: "Projet design",
      portfolio_design_label: "Design",
      portfolio_video_title: "Projet montage vidéo",
      portfolio_video_label: "Vidéo",
      portfolio_dev1_desc: "Projet web récent : vitrine moderne et responsive.",
      portfolio_dev1_link: "Voir le site",
      portfolio_design1_desc: "Présentation visuelle et mise en contexte premium.",
      portfolio_design2_desc: "Identité graphique élégante et mémorable.",
      portfolio_design3_desc: "Affiche impactante avec hiérarchie claire.",
      portfolio_design4_desc: "Packaging et mise en avant de marque.",
      portfolio_design5_desc: "Création de logo Pour Chorale",
      portfolio_video1_desc: "Montage vidéo",
      portfolio_video_fallback: "Votre navigateur ne supporte pas la lecture vidéo.",
      portfolio_video_empty:
        "Les projets de montage vidéo seront ajoutés ici prochainement.",
      about_badge: "Développeur & Designer de Solutions Digitales",
      about_location: "Basé à Lomé - Togo",
      about_title: "À propos",
      about_p1:
        "Je suis développeur et designer spécialisé dans la création de solutions web et mobiles modernes, performantes et visuellement impactantes.",
      about_p2:
        "J'accompagne les entreprises et les entrepreneurs dans la digitalisation de leurs activités, en concevant des produits qui allient technologie, design et efficacité. Mon objectif est simple : transformer vos idées en solutions concrètes, utiles et rentables.",
      about_p3:
        "Grâce à une maîtrise de technologies comme Python, JavaScript, PHP, Java et Flutter, je développe des systèmes complets, de la conception technique jusqu'à l'expérience utilisateur.",
      about_p4:
        "Mais au-delà du développement, je porte une attention particulière au design et à l'expérience utilisateur (UI/UX).",
      about_ui_title: "Chaque interface est",
      about_ui_1: "Moderne",
      about_ui_2: "Intuitive",
      about_ui_3: "Rapide",
      about_ui_4: "Adaptée aux utilisateurs réels",
      about_build_title: "Ce que je conçois",
      about_build_1: "Applications web sur mesure",
      about_build_2: "Plateformes digitales (marketplace, outils de gestion)",
      about_build_3: "Applications mobiles performantes",
      about_build_4: "Interfaces UI/UX modernes et professionnelles",
      about_build_5: "Systèmes d'automatisation pour optimiser les activités",
      about_diff_title: "Ce qui me différencie",
      about_diff_1: "Double compétence développement + design",
      about_diff_2: "Approche centrée sur l'utilisateur et les résultats",
      about_diff_3: "Solutions adaptées aux réalités africaines",
      about_diff_4: "Attention aux détails visuels et à la performance",
      about_diff_5: "Capacité à transformer une idée en produit complet",
      about_skills_title: "Compétences clés",
      about_tools_title: "Outils maîtrisés",
      contact_title: "Contact",
      contact_subtitle:
        "Un projet en tête ? Parlons-en et construisons ensemble une solution sur-mesure.",
      contact_info_title: "Disponibilité & infos",
      contact_info_desc:
        "Lomé - Togo · Disponible pour missions freelance et collaborations long terme.",
      contact_email_label_info: "Email :",
      contact_phone_label: "Téléphone :",
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
      footer_tagline: "Développeur FullStack & Designer Graphique",
      footer_rights: "Tous droits réservés.",
      back_to_top: "Revenir en haut",
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
      about_location: "Based in Lomé - Togo",
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
      contact_info_desc: "Lomé - Togo · Available for freelance and long-term work.",
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
      nav_about: "Sobre mí",
      nav_contact: "Contacto",
      nav_language_label: "Idioma",
      nav_menu_label: "Abrir menú",
      hero_portfolio: "Portafolio",
      hero_alias: "alias Davson",
      hero_role_line: "Desarrollador Full Stack y Diseñador de Soluciones Digitales",
      hero_desc:
        "Creo soluciones web y móviles modernas, rápidas y visualmente impactantes.",
      hero_cta_primary: "Ver mis trabajos",
      hero_cta_secondary: "Hablemos de tu proyecto",
      hero_availability_label: "Disponibilidad",
      hero_availability_title: "Nuevos proyectos",
      hero_availability_note: "Disponible para abril 2026",
      hero_focus_label: "Enfoque",
      hero_focus_title: "Diseño y Dev",
      hero_focus_note: "Sitios, dashboards, branding",
      hero_stack_label: "Stack",
      hero_stack_title: "Web moderna",
      hero_stack_note: "JS, Tailwind, Webflow",
      hero_support_label: "Soporte",
      hero_support_title: "Colaboración",
      hero_support_note: "Del brief al lanzamiento",
      services_title: "Servicios",
      services_subtitle:
        "Soluciones completas para ayudarte a construir una presencia digital coherente y memorable.",
      services_dev_title: "Desarrollo web y apps móviles",
      services_dev_desc:
        "Sitios vitrina, landing pages y dashboards con código limpio y mantenible.",
      services_dev_tag: "Front-end e Integración",
      services_ui_title: "Diseño UI/UX",
      services_ui_desc:
        "Interfaces centradas en el usuario, prototipos interactivos y sistemas escalables.",
      services_ui_tag: "Wireframes y Design System",
      services_brand_title: "Branding",
      services_brand_desc:
        "Identidades visuales completas: logos, guías y recursos premium.",
      services_brand_tag: "Logo e Identidad",
      portfolio_title: "Portafolio",
      portfolio_subtitle:
        "Una selección de proyectos recientes que muestran la dirección visual y la experiencia.",
      portfolio_dev_title: "Proyectos de desarrollo",
      portfolio_dev_label: "Dev",
      portfolio_design_title: "Proyectos de diseño",
      portfolio_design_label: "Diseño",
      portfolio_video_title: "Proyectos de edición de video",
      portfolio_video_label: "Video",
      portfolio_dev1_desc: "Proyecto web reciente: vitrina moderna y responsive.",
      portfolio_dev1_link: "Ver sitio",
      portfolio_design1_desc: "Presentación visual y mockup premium.",
      portfolio_design2_desc: "Identidad gráfica elegante y memorable.",
      portfolio_design3_desc: "Afiche impactante con jerarquía clara.",
      portfolio_design4_desc: "Packaging y realce de marca.",
      portfolio_design5_desc: "Creación de logo para coro.",
      portfolio_video1_desc: "Edición de video",
      portfolio_video_fallback: "Tu navegador no soporta la reproducción de video.",
      portfolio_video_empty: "Los proyectos de edición de video se añadirán pronto.",
      about_badge: "Desarrollador y Diseñador de Soluciones Digitales",
      about_location: "Con base en Lomé - Togo",
      about_title: "Sobre mí",
      about_p1:
        "Soy desarrollador y diseñador especializado en soluciones web y móviles modernas, rápidas e impactantes.",
      about_p2:
        "Ayudo a empresas y emprendedores a digitalizar sus actividades, creando productos que combinan tecnología, diseño y eficiencia.",
      about_p3:
        "Con dominio de Python, JavaScript, PHP, Java y Flutter, desarrollo sistemas completos desde la concepción técnica hasta la experiencia de usuario.",
      about_p4:
        "Más allá del desarrollo, cuido el diseño y la experiencia de usuario (UI/UX).",
      about_ui_title: "Cada interfaz es",
      about_ui_1: "Moderna",
      about_ui_2: "Intuitiva",
      about_ui_3: "Rápida",
      about_ui_4: "Adaptada a usuarios reales",
      about_build_title: "Lo que diseño",
      about_build_1: "Aplicaciones web a medida",
      about_build_2: "Plataformas digitales (marketplace, gestión)",
      about_build_3: "Apps móviles de alto rendimiento",
      about_build_4: "Interfaces UI/UX modernas y profesionales",
      about_build_5: "Sistemas de automatización para optimizar actividades",
      about_diff_title: "Lo que me diferencia",
      about_diff_1: "Doble competencia: desarrollo + diseño",
      about_diff_2: "Enfoque centrado en el usuario y resultados",
      about_diff_3: "Soluciones adaptadas a realidades africanas",
      about_diff_4: "Atención al detalle visual y rendimiento",
      about_diff_5: "Capacidad de convertir una idea en producto completo",
      about_skills_title: "Habilidades clave",
      about_tools_title: "Herramientas",
      contact_title: "Contacto",
      contact_subtitle:
        "¿Tienes un proyecto? Hablemos y construyamos una solución a medida.",
      contact_info_title: "Disponibilidad y info",
      contact_info_desc: "Lomé - Togo · Disponible para freelance y colaboraciones.",
      contact_email_label_info: "Email:",
      contact_phone_label: "Teléfono:",
      contact_location_label: "Ubicación:",
      contact_whatsapp: "WhatsApp",
      contact_form_title: "Enviar un mensaje",
      contact_name_label: "Nombre completo",
      contact_name_placeholder: "Tu nombre",
      contact_email_label: "Correo",
      contact_email_placeholder: "tu@correo.com",
      contact_message_label: "Mensaje",
      contact_message_placeholder: "Cuéntame sobre tu proyecto...",
      contact_send: "Enviar",
      footer_tagline: "Desarrollador Full Stack y Diseñador Gráfico",
      footer_rights: "Todos los derechos reservados.",
      back_to_top: "Volver arriba",
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
      nav_language_label: "Idioma",
      nav_menu_label: "Abrir menu",
      hero_portfolio: "Portfólio",
      hero_alias: "alias Davson",
      hero_role_line: "Desenvolvedor Full Stack & Designer de Soluções Digitais",
      hero_desc:
        "Crio soluções web e mobile modernas, rápidas e visualmente impactantes.",
      hero_cta_primary: "Ver meus trabalhos",
      hero_cta_secondary: "Vamos falar do seu projeto",
      hero_availability_label: "Disponibilidade",
      hero_availability_title: "Novos projetos",
      hero_availability_note: "Disponível para abril de 2026",
      hero_focus_label: "Foco",
      hero_focus_title: "Design & Dev",
      hero_focus_note: "Sites, dashboards, branding",
      hero_stack_label: "Stack",
      hero_stack_title: "Web moderna",
      hero_stack_note: "JS, Tailwind, Webflow",
      hero_support_label: "Suporte",
      hero_support_title: "Parceria",
      hero_support_note: "Do briefing ao lançamento",
      services_title: "Serviços",
      services_subtitle:
        "Soluções completas para ajudar você a construir uma presença digital coerente e memorável.",
      services_dev_title: "Desenvolvimento web e apps móveis",
      services_dev_desc:
        "Sites institucionais, landing pages e dashboards com código limpo e sustentável.",
      services_dev_tag: "Front-end & Integração",
      services_ui_title: "Design UI/UX",
      services_ui_desc:
        "Interfaces centradas no usuário, protótipos interativos e sistemas escaláveis.",
      services_ui_tag: "Wireframes & Design System",
      services_brand_title: "Branding",
      services_brand_desc:
        "Identidades visuais completas: logotipos, guias e materiais premium.",
      services_brand_tag: "Logo & Identidade",
      portfolio_title: "Portfólio",
      portfolio_subtitle:
        "Uma seleção de projetos recentes que mostram direção visual e expertise.",
      portfolio_dev_title: "Projetos de desenvolvimento",
      portfolio_dev_label: "Dev",
      portfolio_design_title: "Projetos de design",
      portfolio_design_label: "Design",
      portfolio_video_title: "Projetos de edição de vídeo",
      portfolio_video_label: "Vídeo",
      portfolio_dev1_desc: "Projeto web recente: vitrine moderna e responsiva.",
      portfolio_dev1_link: "Ver site",
      portfolio_design1_desc: "Apresentação visual e mockup premium.",
      portfolio_design2_desc: "Identidade visual elegante e memorável.",
      portfolio_design3_desc: "Cartaz impactante com hierarquia clara.",
      portfolio_design4_desc: "Embalagem e destaque de marca.",
      portfolio_design5_desc: "Criação de logo para coral.",
      portfolio_video1_desc: "Edição de vídeo",
      portfolio_video_fallback: "Seu navegador não suporta reprodução de vídeo.",
      portfolio_video_empty: "Os projetos de edição de vídeo serão adicionados em breve.",
      about_badge: "Desenvolvedor & Designer de Soluções Digitais",
      about_location: "Baseado em Lomé - Togo",
      about_title: "Sobre",
      about_p1:
        "Sou desenvolvedor e designer especializado em soluções web e mobile modernas e impactantes.",
      about_p2:
        "Acompanho empresas e empreendedores na digitalização, criando produtos que unem tecnologia, design e eficiência.",
      about_p3:
        "Domino Python, JavaScript, PHP, Java e Flutter para entregar sistemas completos do design técnico à experiência do usuário.",
      about_p4:
        "Além do desenvolvimento, cuido do design e da experiência do usuário (UI/UX).",
      about_ui_title: "Cada interface é",
      about_ui_1: "Moderna",
      about_ui_2: "Intuitiva",
      about_ui_3: "Rápida",
      about_ui_4: "Adaptada a usuários reais",
      about_build_title: "O que eu construo",
      about_build_1: "Aplicações web sob medida",
      about_build_2: "Plataformas digitais (marketplace, gestão)",
      about_build_3: "Apps móveis de alta performance",
      about_build_4: "Interfaces UI/UX modernas e profissionais",
      about_build_5: "Sistemas de automação para otimizar atividades",
      about_diff_title: "O que me diferencia",
      about_diff_1: "Dupla competência: desenvolvimento + design",
      about_diff_2: "Abordagem centrada no usuário e resultados",
      about_diff_3: "Soluções adaptadas às realidades africanas",
      about_diff_4: "Atenção aos detalhes visuais e performance",
      about_diff_5: "Capacidade de transformar uma ideia em produto completo",
      about_skills_title: "Competências-chave",
      about_tools_title: "Ferramentas",
      contact_title: "Contato",
      contact_subtitle:
        "Tem um projeto em mente? Vamos conversar e criar uma solução sob medida.",
      contact_info_title: "Disponibilidade e info",
      contact_info_desc: "Lomé - Togo · Disponível para freelance e longo prazo.",
      contact_email_label_info: "Email:",
      contact_phone_label: "Telefone:",
      contact_location_label: "Localização:",
      contact_whatsapp: "WhatsApp",
      contact_form_title: "Enviar uma mensagem",
      contact_name_label: "Nome completo",
      contact_name_placeholder: "Seu nome",
      contact_email_label: "Email",
      contact_email_placeholder: "seu@email.com",
      contact_message_label: "Mensagem",
      contact_message_placeholder: "Conte sobre seu projeto...",
      contact_send: "Enviar",
      footer_tagline: "Desenvolvedor Full Stack & Designer Gráfico",
      footer_rights: "Todos os direitos reservados.",
      back_to_top: "Voltar ao topo",
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

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      if (dict[key]) {
        el.setAttribute("aria-label", dict[key]);
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





