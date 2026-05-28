(function () {
  "use strict";

  /* ===== CONFIGURATION ===== */
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || window.innerWidth < 768;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  /* ===== SCROLL SETUP ===== */
  let lenis = null;

  /* ===== i18n TRANSLATIONS ===== */
  const translations = {
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.skills": "Skills",
      "nav.portfolio": "Portfolio",
      "nav.education": "Education",
      "nav.contact": "Contact",
      "hero.greeting": "Hello, I'm",
      "hero.scroll": "Scroll",
      "about.tag": "About Me",
      "about.title": 'Crafting Code,<br>Building <span class="accent">Solutions</span>',
      "about.badge": "Software Engineer",
      "about.lead": '"Passionate about transforming complex problems into elegant, efficient software solutions."',
      "about.p1": 'Hello! I\'m Ahmet Eray Alkan, a Software Engineer with a strong background in Java Development, AI Training, and Data Analytics. I bring a unique blend of engineering knowledge and software expertise to every project I work on.',
      "about.p2": 'I gained valuable hands-on experience as a Software Engineering Intern at <strong>JForce</strong>, where I worked on various enterprise projects and enhanced my technical skills in Spring Boot, SQL, and full-stack development.',
      "about.p3": 'I hold esteemed certifications including <strong>Oracle Java Development</strong>, <strong>Google Cloud Data Analytics</strong>, <strong>Google Cybersecurity Specialization</strong>, and <strong>Google Generative AI for Developers</strong>. My graduate project focused on <strong>Fraud Detection with AI Training</strong>, leveraging advanced machine learning techniques to identify and prevent fraudulent activities.',
      "about.p4": 'Originally starting my academic journey in Electrical and Electronics Engineering, my passion for software led me to transition into Software Engineering \u2014 allowing me to leverage technical knowledge across a broader spectrum and gain deep understanding of the Software Development Life Cycle.',
      "about.stat1": "Years Experience",
      "about.stat2": "Projects",
      "about.stat3": "Certifications",
      "skills.tag": "Expertise",
      "skills.title": 'Skills & <span class="accent">Technologies</span>',
      "skill.java": "Skilled in Java programming for software development and data processing. Oracle Certified Java Developer.",
      "skill.python": "Experienced in developing software solutions and performing data analysis. Google Cloud Data Analytics certified.",
      "skill.spring": "Experienced in building robust and scalable enterprise applications. Applied extensively during internship at JForce.",
      "skill.ai": "Expert in developing AI training pipelines, deep learning frameworks, and model optimization for real-world applications.",
      "skill.rl": "Experienced in designing RL models for dynamic environments with reward-based training strategies.",
      "skill.sql": "Proficient with Oracle, MongoDB, PostgreSQL. Skilled in designing, querying, and optimizing relational databases.",
      "skill.cyber": "Google Cybersecurity Specialization certified. Skilled in penetration testing, Metasploit, and vulnerability assessment.",
      "skill.c": "Strong foundation for embedded systems and performance-critical applications. Experience with Atmel processors and Keil IDE.",
      "skill.data": "Google Cloud Data Analytics certified. Proficient in data processing, visualization, and actionable insights.",
      "skill.web": "Full-stack web development with HTML, CSS, JavaScript. Experience building responsive, modern web applications.",
      "skill.sdlc": "Deep knowledge of Agile, Waterfall, and hybrid SDLC models. Team leadership and project management experience.",
      "skill.iot": "Experienced in prototyping electronic projects using Arduino, RFID, SPI communication, and embedded systems.",
      "quote.text": '"Thank you to everyone who helped me reach my current excellence."',
      "quote.author": "\u2014 Ahmet Eray Alkan",
      "portfolio.tag": "Portfolio",
      "portfolio.title": 'Featured <span class="accent">Work</span>',
      "portfolio.all": "All",
      "portfolio.app": "App",
      "portfolio.certificates": "Certificates",
      "portfolio.projects": "Projects",
      "portfolio.job": "Job",
      "edu.tag": "Education",
      "edu.title": 'Academic <span class="accent">Journey</span>',
      "edu.erciyes.desc": "Studied Bachelor\u2019s degree \u2014 transitioned to Software Engineering to follow passion for software development.",
      "edu.emu.name": "Eastern Mediterranean University<br>Software Engineering",
      "edu.emu.desc": "Bachelor\u2019s degree in Software Engineering (ABET Accredited), Famagusta, Cyprus.",
      "edu.abet.period": "Accredited",
      "edu.abet.name": "ABET Accreditation",
      "edu.abet.desc": "Software Engineering program accredited by ABET \u2014 ensuring world-class education standards.",
      "contact.tag": "Contact",
      "contact.title": 'Let\'s <span class="accent">Connect</span>',
      "contact.heading": "Get in Touch",
      "contact.subtitle": "Feel free to reach out for collaborations or just a friendly chat.",
      "contact.send": "Send Message",
      "cta.title": 'Ready to Build<br>Something <span class="accent">Amazing</span>?',
      "cta.btn": "Let's Talk",
      "footer.copy": "\u00a9 2026 Ahmet Eray Alkan. All rights reserved.",
      "form.name": "Your Name",
      "form.email": "Your Email",
      "form.subject": "Subject",
      "form.message": "Your Message",
      "typed": "Software Engineer, AI Enthusiast, Problem Solver, Java Developer"
    },
    tr: {
      "nav.home": "Ana Sayfa",
      "nav.about": "Hakk\u0131mda",
      "nav.skills": "Yetenekler",
      "nav.portfolio": "Portf\u00f6y",
      "nav.education": "E\u011fitim",
      "nav.contact": "\u0130leti\u015fim",
      "hero.greeting": "Merhaba, ben",
      "hero.scroll": "Kayd\u0131r",
      "about.tag": "Hakk\u0131mda",
      "about.title": 'Kod Yaz\u0131yorum,<br>\u00c7\u00f6z\u00fcmler <span class="accent">\u00dcretiyorum</span>',
      "about.badge": "Yaz\u0131l\u0131m M\u00fchendisi",
      "about.lead": '"Karma\u015f\u0131k problemleri zarif ve verimli yaz\u0131l\u0131m \u00e7\u00f6z\u00fcmlerine d\u00f6n\u00fc\u015ft\u00fcrme tutkusuyla \u00e7al\u0131\u015f\u0131yorum."',
      "about.p1": "Merhaba! Ben Ahmet Eray Alkan, Java Geli\u015ftirme, Yapay Zeka E\u011fitimi ve Veri Analiti\u011fi konular\u0131nda g\u00fc\u00e7l\u00fc bir altyap\u0131ya sahip bir Yaz\u0131l\u0131m M\u00fchendisiyim. \u00c7al\u0131\u015ft\u0131\u011f\u0131m her projeye m\u00fchendislik bilgisi ve yaz\u0131l\u0131m uzmanl\u0131\u011f\u0131n\u0131n e\u015fsiz birle\u015fimini sunuyorum.",
      "about.p2": '<strong>JForce</strong>\'da Yaz\u0131l\u0131m M\u00fchendisli\u011fi Stajyeri olarak \u00e7e\u015fitli kurumsal projelerde \u00e7al\u0131\u015farak Spring Boot, SQL ve full-stack geli\u015ftirme konular\u0131ndaki teknik becerilerimi geli\u015ftirdim.',
      "about.p3": '<strong>Oracle Java Development</strong>, <strong>Google Cloud Data Analytics</strong>, <strong>Google Cybersecurity Specialization</strong> ve <strong>Google Generative AI for Developers</strong> gibi prestijli sertifikalara sahibim. Bitirme projem, doland\u0131r\u0131c\u0131l\u0131k faaliyetlerini tespit etmek ve \u00f6nlemek i\u00e7in ileri d\u00fczey makine \u00f6\u011frenimi tekniklerinden yararlanan <strong>Yapay Zeka ile Doland\u0131r\u0131c\u0131l\u0131k Tespiti</strong> \u00fczerine odaklanm\u0131\u015ft\u0131r.',
      "about.p4": "Akademik yolculu\u011fuma Elektrik-Elektronik M\u00fchendisli\u011fi ile ba\u015flad\u0131m, yaz\u0131l\u0131ma olan tutkum beni Yaz\u0131l\u0131m M\u00fchendisli\u011fi'ne ge\u00e7i\u015f yapmaya y\u00f6nlendirdi \u2014 bu sayede teknik bilgimi daha geni\u015f bir yelpazede kullanabilir ve Yaz\u0131l\u0131m Geli\u015ftirme Ya\u015fam D\u00f6ng\u00fcs\u00fc hakk\u0131nda derin bir anlay\u0131\u015f kazanabildim.",
      "about.stat1": "Y\u0131l Deneyim",
      "about.stat2": "Proje",
      "about.stat3": "Sertifika",
      "skills.tag": "Uzmanl\u0131k",
      "skills.title": 'Yetenekler & <span class="accent">Teknolojiler</span>',
      "skill.java": "Yaz\u0131l\u0131m geli\u015ftirme ve veri i\u015fleme i\u00e7in Java programlamada uzman. Oracle Sertifikal\u0131 Java Geli\u015ftiricisi.",
      "skill.python": "Yaz\u0131l\u0131m \u00e7\u00f6z\u00fcmleri geli\u015ftirme ve veri analizi yapma konusunda deneyimli. Google Cloud Data Analytics sertifikal\u0131.",
      "skill.spring": "Sa\u011flam ve \u00f6l\u00e7eklenebilir kurumsal uygulamalar olu\u015fturma konusunda deneyimli. JForce staj\u0131nda yo\u011fun olarak uyguland\u0131.",
      "skill.ai": "Yapay zeka e\u011fitim boru hatlar\u0131, derin \u00f6\u011frenme \u00e7er\u00e7eveleri ve ger\u00e7ek d\u00fcnya uygulamalar\u0131 i\u00e7in model optimizasyonu geli\u015ftirme uzman\u0131.",
      "skill.rl": "Dinamik ortamlar i\u00e7in \u00f6d\u00fcl tabanl\u0131 e\u011fitim stratejileriyle Peki\u015ftirmeli \u00d6\u011frenme modelleri tasarlama deneyimi.",
      "skill.sql": "Oracle, MongoDB, PostgreSQL ile yetkin. \u0130li\u015fkisel veritabanlar\u0131 tasarlama, sorgulama ve optimizasyon konusunda uzman.",
      "skill.cyber": "Google Siber G\u00fcvenlik Uzmanl\u0131\u011f\u0131 sertifikal\u0131. S\u0131zma testi, Metasploit ve g\u00fcvenlik a\u00e7\u0131\u011f\u0131 de\u011ferlendirme konusunda yetenekli.",
      "skill.c": "G\u00f6m\u00fcl\u00fc sistemler ve performans odakl\u0131 uygulamalar i\u00e7in g\u00fc\u00e7l\u00fc temel. Atmel i\u015flemciler ve Keil IDE deneyimi.",
      "skill.data": "Google Cloud Data Analytics sertifikal\u0131. Veri i\u015fleme, g\u00f6rselle\u015ftirme ve eyleme d\u00f6n\u00fc\u015ft\u00fcr\u00fclebilir i\u00e7g\u00f6r\u00fcler konusunda uzman.",
      "skill.web": "HTML, CSS, JavaScript ile full-stack web geli\u015ftirme. Duyarl\u0131, modern web uygulamalar\u0131 olu\u015fturma deneyimi.",
      "skill.sdlc": "Agile, Waterfall ve hibrit SDLC modelleri hakk\u0131nda derin bilgi. Tak\u0131m liderli\u011fi ve proje y\u00f6netimi deneyimi.",
      "skill.iot": "Arduino, RFID, SPI ileti\u015fimi ve g\u00f6m\u00fcl\u00fc sistemler kullanarak elektronik proje prototipleme deneyimi.",
      "quote.text": '"Beni \u015fuanki m\u00fckemmelli\u011fime ula\u015ft\u0131ran herkese \u00e7ok te\u015fekk\u00fcr ederim."',
      "quote.author": "\u2014 Ahmet Eray Alkan",
      "portfolio.tag": "Portf\u00f6y",
      "portfolio.title": '\u00d6ne \u00c7\u0131kan <span class="accent">\u00c7al\u0131\u015fmalar</span>',
      "portfolio.all": "T\u00fcm\u00fc",
      "portfolio.app": "Uygulama",
      "portfolio.certificates": "Sertifikalar",
      "portfolio.projects": "Projeler",
      "portfolio.job": "\u0130\u015f",
      "edu.tag": "E\u011fitim",
      "edu.title": 'Akademik <span class="accent">Yolculuk</span>',
      "edu.erciyes.desc": "Lisans e\u011fitimi \u2014 yaz\u0131l\u0131m geli\u015ftirmeye olan tutkusu nedeniyle Yaz\u0131l\u0131m M\u00fchendisli\u011fi'ne ge\u00e7i\u015f yapt\u0131.",
      "edu.emu.name": "Do\u011fu Akdeniz \u00dcniversitesi<br>Yaz\u0131l\u0131m M\u00fchendisli\u011fi",
      "edu.emu.desc": "Yaz\u0131l\u0131m M\u00fchendisli\u011fi Lisans Derecesi (ABET Akredite), Gazima\u011fusa, K\u0131br\u0131s.",
      "edu.abet.period": "Akredite",
      "edu.abet.name": "ABET Akreditasyonu",
      "edu.abet.desc": "ABET taraf\u0131ndan akredite edilen Yaz\u0131l\u0131m M\u00fchendisli\u011fi program\u0131 \u2014 d\u00fcnya standartlar\u0131nda e\u011fitim kalitesi.",
      "contact.tag": "\u0130leti\u015fim",
      "contact.title": '\u0130leti\u015fime <span class="accent">Ge\u00e7in</span>',
      "contact.heading": "\u0130leti\u015fime Ge\u00e7in",
      "contact.subtitle": "\u0130\u015f birlikleri veya sohbet i\u00e7in benimle ileti\u015fime ge\u00e7ebilirsiniz.",
      "contact.send": "Mesaj G\u00f6nder",
      "cta.title": 'Harika Bir \u015eey<br>\u0130n\u015fa Etmeye <span class="accent">Haz\u0131r m\u0131s\u0131n\u0131z</span>?',
      "cta.btn": "Konu\u015fal\u0131m",
      "footer.copy": "\u00a9 2026 Ahmet Eray Alkan. T\u00fcm haklar\u0131 sakl\u0131d\u0131r.",
      "form.name": "Ad\u0131n\u0131z",
      "form.email": "E-posta Adresiniz",
      "form.subject": "Konu",
      "form.message": "Mesaj\u0131n\u0131z",
      "typed": "Yaz\u0131l\u0131m M\u00fchendisi, Yapay Zeka Tutkunu, Problem \u00c7\u00f6z\u00fcc\u00fc, Java Geli\u015ftirici"
    }
  };

  let currentLang = localStorage.getItem("lang") || "en";

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang);

    var t = translations[lang];
    if (!t) return;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) el.setAttribute("placeholder", t[key]);
    });

    var langLabel = document.getElementById("lang-label");
    if (langLabel) langLabel.textContent = lang === "en" ? "TR" : "EN";

    if (t["typed"]) {
      var typedEl = select(".typed");
      if (typedEl) typedEl.setAttribute("data-typed-items", t["typed"]);
    }
  }

  function initLanguageToggle() {
    var toggle = document.getElementById("lang-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var newLang = currentLang === "en" ? "tr" : "en";
      applyLanguage(newLang);

      var typedEl = select(".typed");
      if (typedEl && typeof Typed !== "undefined") {
        var wrapper = typedEl.parentElement;
        if (wrapper) {
          var newEl = document.createElement("span");
          newEl.className = "typed";
          newEl.setAttribute("data-typed-items", translations[newLang]["typed"]);
          typedEl.remove();
          var cursorEl = wrapper.querySelector(".typed-cursor");
          if (cursorEl) cursorEl.remove();
          wrapper.appendChild(newEl);
          new Typed(".typed", {
            strings: translations[newLang]["typed"].split(",").map(function (s) { return s.trim(); }),
            loop: true,
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 2500,
          });
        }
      }
    });
  }

  window.addEventListener("load", function () {
    var savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== "en") applyLanguage(savedLang);
    initLanguageToggle();
  });

  /* ===== PRELOADER ===== */
  window.addEventListener("load", () => {
    const preloader = select("#preloader");
    if (!preloader) return;

    const delay = 2200;

    if (typeof gsap !== "undefined") {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        delay: delay / 1000,
        ease: "power2.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          startHeroAnimation();
        },
      });
    } else {
      setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.transition = "opacity 0.8s ease";
        setTimeout(() => {
          preloader.style.display = "none";
          startHeroAnimation();
        }, 800);
      }, delay);
    }
  });

  /* ===== CUSTOM CURSOR + TRAIL ===== */
  const cursorDot = select(".cursor-dot");
  const cursorOutline = select(".cursor-outline");

  if (cursorDot && cursorOutline && !isTouch) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    const trailElements = [];
    const TRAIL_COUNT = 5;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.width = (4 - i * 0.5) + "px";
      trail.style.height = (4 - i * 0.5) + "px";
      document.body.appendChild(trail);
      trailElements.push({ el: trail, x: 0, y: 0 });
    }

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = outlineX + "px";
      cursorOutline.style.top = outlineY + "px";

      let prevX = mouseX, prevY = mouseY;
      trailElements.forEach((t, i) => {
        const speed = 0.25 - i * 0.03;
        t.x += (prevX - t.x) * speed;
        t.y += (prevY - t.y) * speed;
        t.el.style.left = t.x + "px";
        t.el.style.top = t.y + "px";
        t.el.style.opacity = (0.4 - i * 0.07);
        prevX = t.x;
        prevY = t.y;
      });

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    function setupHoverTargets() {
      const hoverTargets = "a, button, .portfolio-card, .skill-card, .education-card, .social-link, .btn-submit, .cta-btn, #portfolio-flters li, .mobile-nav-toggle";
      document.querySelectorAll(hoverTargets).forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursorDot.classList.add("hovering");
          cursorOutline.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
          cursorDot.classList.remove("hovering");
          cursorOutline.classList.remove("hovering");
        });
      });
    }
    setupHoverTargets();
    window.addEventListener("load", setupHoverTargets);
  }

  /* ===== THREE.JS 3D SCENE ===== */
  function initThreeScene() {
    if (typeof THREE === "undefined" || prefersReducedMotion) return;
    const container = select("#three-canvas");
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    camera.position.z = 30;

    const goldColor = 0xc9a96e;
    const geometries = [];

    const shapes = [
      { Geo: THREE.IcosahedronGeometry, args: [2, 1], count: isMobile ? 4 : 8 },
      { Geo: THREE.OctahedronGeometry, args: [1.5, 0], count: isMobile ? 2 : 5 },
      { Geo: THREE.TorusGeometry, args: [1.2, 0.3, 8, 16], count: isMobile ? 1 : 3 },
    ];

    shapes.forEach(({ Geo, args, count }) => {
      for (let i = 0; i < count; i++) {
        const geo = new Geo(...args);
        const mat = new THREE.MeshBasicMaterial({
          color: goldColor,
          wireframe: true,
          transparent: true,
          opacity: Math.random() * 0.1 + 0.03,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20 - 5
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData = {
          rotSpeed: { x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.004, z: (Math.random() - 0.5) * 0.002 },
          floatSpeed: Math.random() * 0.4 + 0.3,
          floatOffset: Math.random() * Math.PI * 2,
          baseY: mesh.position.y,
        };
        scene.add(mesh);
        geometries.push(mesh);
      }
    });

    const particleCount = isMobile ? 80 : 250;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: goldColor,
      size: 0.06,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let targetCamX = 0, targetCamY = 0;
    if (!isTouch) {
      document.addEventListener("mousemove", (e) => {
        targetCamX = (e.clientX / window.innerWidth - 0.5) * 4;
        targetCamY = (e.clientY / window.innerHeight - 0.5) * -3;
      });
    }

    const clock = new THREE.Clock();
    let threeActive = true;

    const heroEl = document.getElementById("hero");
    const heroObserver = new IntersectionObserver((entries) => {
      threeActive = entries[0].isIntersecting;
    }, { threshold: 0 });
    if (heroEl) heroObserver.observe(heroEl);

    function animate() {
      requestAnimationFrame(animate);
      if (!threeActive) return;
      const elapsed = clock.getElapsedTime();

      geometries.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotSpeed.x;
        mesh.rotation.y += mesh.userData.rotSpeed.y;
        mesh.rotation.z += mesh.userData.rotSpeed.z;
        mesh.position.y = mesh.userData.baseY + Math.sin(elapsed * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 1.5;
      });

      particles.rotation.y += 0.00015;
      particles.rotation.x += 0.00005;

      camera.position.x += (targetCamX - camera.position.x) * 0.02;
      camera.position.y += (targetCamY - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      if (!container.offsetWidth) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
  }
  initThreeScene();

  /* ===== TEXT SPLITTING ===== */
  function splitTextToChars(element) {
    const text = element.textContent;
    element.textContent = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.display = "inline-block";
      span.textContent = char === " " ? "\u00A0" : char;
      element.appendChild(span);
    });
    return element.querySelectorAll(".char");
  }

  /* ===== HERO ANIMATION ===== */
  function startHeroAnimation() {
    if (typeof gsap === "undefined") {
      select(".hero-greeting").style.opacity = "1";
      select(".hero-typed-wrapper").style.opacity = "1";
      select(".hero-social").style.opacity = "1";
      select(".scroll-indicator").style.opacity = "1";
      document.querySelectorAll(".hero-name-line .char").forEach((c) => { c.style.opacity = "1"; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-greeting", { opacity: 1, y: 0, duration: 0.8 }, 0)
      .to(".hero-name-line .char", {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.03,
        duration: 0.7,
      }, 0.2)
      .to(".hero-typed-wrapper", { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .to(".hero-social .social-link", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
      }, 1.0)
      .to(".scroll-indicator", { opacity: 1, duration: 0.8 }, 1.2);
  }

  function prepareHero() {
    const lines = document.querySelectorAll(".hero-name-line");
    lines.forEach((line) => splitTextToChars(line));

    if (typeof gsap !== "undefined") {
      gsap.set(".hero-greeting", { opacity: 0, y: 30 });
      gsap.set(".hero-name-line .char", { opacity: 0, y: 80, rotateX: -60 });
      gsap.set(".hero-typed-wrapper", { opacity: 0, y: 30 });
      gsap.set(".hero-social .social-link", { opacity: 0, y: 30 });
      gsap.set(".scroll-indicator", { opacity: 0 });
    }
  }
  prepareHero();

  /* ===== HERO PARALLAX (Mouse) ===== */
  if (!isTouch && !prefersReducedMotion) {
    const heroBg = select(".hero-bg");
    const heroContent = select(".hero-content");
    if (heroBg && heroContent && typeof gsap !== "undefined") {
      document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(heroBg, { x: x * 15, y: y * 15, duration: 1.2, ease: "power2.out" });
        gsap.to(heroContent, { x: x * -8, y: y * -8, duration: 1.2, ease: "power2.out" });
      });
    }
  }

  /* ===== GSAP SCROLL ANIMATIONS ===== */
  function revealOnScroll(selector, fromVars, triggerEl, staggerAmt) {
    const elements = gsap.utils.toArray(selector);
    if (!elements.length) return;
    gsap.set(elements, fromVars);
    ScrollTrigger.create({
      trigger: triggerEl || elements[0],
      start: "top 88%",
      once: true,
      onEnter: () => {
        const toVars = { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, ease: "power3.out", overwrite: true };
        if (staggerAmt) toVars.stagger = staggerAmt;
        gsap.to(elements, toVars);
      },
    });
  }

  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero scroll exit */
    gsap.to(".hero-content", {
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.5 },
      y: -100, opacity: 0, ease: "none",
    });
    gsap.to(".scroll-indicator", {
      scrollTrigger: { trigger: "#hero", start: "10% top", end: "30% top", scrub: true },
      opacity: 0,
    });

    /* Section headers */
    gsap.utils.toArray(".section-header").forEach((header) => {
      const tag = header.querySelector(".section-tag");
      const title = header.querySelector(".section-title");
      if (tag) gsap.set(tag, { opacity: 0, y: 30 });
      if (title) gsap.set(title, { opacity: 0, y: 50 });
      ScrollTrigger.create({
        trigger: header,
        start: "top 88%",
        once: true,
        onEnter: () => {
          if (tag) gsap.to(tag, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
          if (title) gsap.to(title, { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: "power3.out" });
        },
      });
    });

    /* About section */
    revealOnScroll(".about-img-wrapper", { opacity: 0, x: -80 }, "#about");
    revealOnScroll(".about-content", { opacity: 0, x: 80 }, "#about");
    revealOnScroll(".stat-item", { opacity: 0, y: 40 }, ".about-stats", 0.15);

    /* Skill cards */
    const skillCards = gsap.utils.toArray(".skill-card");
    if (skillCards.length) {
      gsap.set(skillCards, { opacity: 0, y: 60, scale: 0.9 });
      ScrollTrigger.create({
        trigger: ".skills-grid",
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(skillCards, { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.6, ease: "back.out(1.2)", overwrite: true });
        },
      });
    }

    /* Parallax divider */
    revealOnScroll(".parallax-content", { opacity: 0, y: 40, scale: 0.95 }, ".parallax-divider");

    /* Portfolio items */
    const portfolioItems = gsap.utils.toArray(".portfolio-item");
    if (portfolioItems.length) {
      gsap.set(portfolioItems, { opacity: 0, y: 60 });
      ScrollTrigger.create({
        trigger: ".portfolio-container",
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(portfolioItems, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out", overwrite: true });
        },
      });
    }

    /* Education cards */
    revealOnScroll(".education-card", { opacity: 0, y: 50 }, ".education-grid", 0.15);

    /* Contact */
    revealOnScroll(".contact-info-card", { opacity: 0, x: -60 }, ".contact-wrapper");
    revealOnScroll(".contact-form-card", { opacity: 0, x: 60 }, ".contact-wrapper");

    /* CTA */
    revealOnScroll(".cta-content", { opacity: 0, y: 60, scale: 0.95 }, ".cta-section");

    /* Parallax scroll on backgrounds */
    if (!isMobile) {
      gsap.to(".hero-bg", {
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
        y: 150, ease: "none",
      });
      gsap.to(".parallax-bg", {
        scrollTrigger: { trigger: ".parallax-divider", start: "top bottom", end: "bottom top", scrub: true },
        y: -80, ease: "none",
      });
    }

    /* Counter animation */
    gsap.utils.toArray("[data-count]").forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-count"), 10);
      const suffix = counter.getAttribute("data-suffix") || "";
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: counter,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target, duration: 2, ease: "power1.out",
            onUpdate: () => { counter.textContent = Math.round(obj.val) + suffix; },
          });
        },
      });
    });

    ScrollTrigger.refresh();
  }

  window.addEventListener("load", () => {
    initScrollAnimations();
    setTimeout(() => { if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); }, 500);
  });

  /* ===== MAGNETIC BUTTONS ===== */
  function initMagneticButtons() {
    if (isTouch || typeof gsap === "undefined") return;
    document.querySelectorAll(".magnetic-btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
    });
  }
  window.addEventListener("load", initMagneticButtons);

  /* ===== HEADER SCROLL ===== */
  const header = select("#header");
  if (header) {
    const headerScrolled = () => {
      if (window.scrollY > 80) header.classList.add("header-scrolled");
      else header.classList.remove("header-scrolled");
    };
    window.addEventListener("load", headerScrolled);
    document.addEventListener("scroll", headerScrolled);
  }

  /* ===== NAVBAR ACTIVE LINK ===== */
  const navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  document.addEventListener("scroll", navbarlinksActive);

  /* ===== SMOOTH SCROLL ===== */
  const scrollto = (el) => {
    const headerEl = select("#header");
    const offset = headerEl ? headerEl.offsetHeight : 0;
    const target = select(el);
    if (!target) return;
    const elementPos = target.offsetTop;

    if (lenis) {
      lenis.scrollTo(target, { offset: -offset });
    } else {
      window.scrollTo({ top: elementPos - offset, behavior: "smooth" });
    }
  };

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".scrollto");
    if (!link || !link.hash) return;
    if (select(link.hash)) {
      e.preventDefault();
      const navbar = select("#navbar");
      if (navbar.classList.contains("navbar-mobile")) {
        navbar.classList.remove("navbar-mobile");
        const toggle = select(".mobile-nav-toggle");
        if (toggle) toggle.classList.remove("active");
      }
      scrollto(link.hash);
    }
  });

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  /* ===== BACK TO TOP ===== */
  const backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) backtotop.classList.add("active");
      else backtotop.classList.remove("active");
    };
    window.addEventListener("load", toggleBacktotop);
    document.addEventListener("scroll", toggleBacktotop);

    backtotop.addEventListener("click", (e) => {
      e.preventDefault();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===== MOBILE NAV ===== */
  const mobileToggle = select(".mobile-nav-toggle");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      const navbar = select("#navbar");
      navbar.classList.toggle("navbar-mobile");
      this.classList.toggle("active");
    });
  }

  /* ===== TYPED EFFECT ===== */
  const typed = select(".typed");
  if (typed && typeof Typed !== "undefined") {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",").map((s) => s.trim());
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 2500,
    });
  }

  /* ===== ISOTOPE PORTFOLIO FILTER ===== */
  window.addEventListener("load", () => {
    const portfolioContainer = select(".portfolio-container");
    if (portfolioContainer && typeof Isotope !== "undefined") {
      const portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      const portfolioFilters = select("#portfolio-flters li", true);
      portfolioFilters.forEach((filterEl) => {
        filterEl.addEventListener("click", function (e) {
          e.preventDefault();
          portfolioFilters.forEach((el) => el.classList.remove("filter-active"));
          this.classList.add("filter-active");
          portfolioIsotope.arrange({ filter: this.getAttribute("data-filter") });
          setTimeout(function () {
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
          }, 600);
        });
      });
    }
  });

  /* ===== GLIGHTBOX ===== */
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: ".portfolio-lightbox" });
  }

  /* ===== 3D CARD TILT ===== */
  if (!isTouch) {
    const tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        if (typeof gsap !== "undefined") {
          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            transformPerspective: 800,
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }

        const glowEl = card.querySelector(".tilt-glow");
        if (glowEl) {
          glowEl.style.setProperty("--mouse-x", (x / rect.width) * 100 + "%");
          glowEl.style.setProperty("--mouse-y", (y / rect.height) * 100 + "%");
        }
      });

      card.addEventListener("mouseleave", () => {
        if (typeof gsap !== "undefined") {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)",
          });
        } else {
          card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
          card.style.transition = "transform 0.5s ease";
          setTimeout(() => (card.style.transition = ""), 500);
        }
      });

      card.addEventListener("mouseenter", () => {
        if (typeof gsap === "undefined") card.style.transition = "none";
      });
    });
  }

  /* ===== WEB3FORMS CONTACT FORM ===== */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const loading = this.querySelector(".loading");
      const errorMsg = this.querySelector(".error-message");
      const sentMsg = this.querySelector(".sent-message");
      const submitBtn = this.querySelector(".btn-submit");

      loading.style.display = "block";
      errorMsg.style.display = "none";
      sentMsg.style.display = "none";
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(this);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          loading.style.display = "none";
          if (data.success) {
            sentMsg.style.display = "block";
            contactForm.reset();
            setTimeout(function () {
              sentMsg.style.display = "none";
            }, 5000);
          } else {
            errorMsg.textContent =
              data.message || "Something went wrong. Please try again.";
            errorMsg.style.display = "block";
          }
        })
        .catch(function () {
          loading.style.display = "none";
          errorMsg.textContent =
            "Connection error. Please try again later.";
          errorMsg.style.display = "block";
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

})();
