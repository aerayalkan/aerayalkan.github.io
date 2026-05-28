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

  /* ===== LENIS SMOOTH SCROLL ===== */
  let lenis = null;
  try {
    if (typeof Lenis !== "undefined" && !prefersReducedMotion && !isMobile) {
      lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.5 });

      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        function lenisRaf(time) { lenis.raf(time); requestAnimationFrame(lenisRaf); }
        requestAnimationFrame(lenisRaf);
      }
    }
  } catch (e) { /* Lenis unavailable, fallback to native scroll */ }

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
    function animate() {
      requestAnimationFrame(animate);
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

})();
