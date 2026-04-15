const navLinks = document.querySelectorAll('a[href^="#"]');
const revealElements = document.querySelectorAll(
  ".about, .speakers, .journey-section, .highlights, .visual-story, .visual-card, .visual-reel, .tickets, .contact-section, .location-panel, .contact-card, .card, .highlight-card"
);
const registerBtn = document.querySelector("#registerBtn");
const revealItems = Array.from(revealElements);
const journeySlides = Array.from(document.querySelectorAll("[data-journey-slide]"));
const journeyImages = Array.from(document.querySelectorAll("[data-journey-image]"));
const journeyDots = Array.from(document.querySelectorAll("[data-journey-dot]"));
const journeyPrev = document.querySelector("#journeyPrev");
const journeyNext = document.querySelector("#journeyNext");
const journeySection = document.querySelector(".journey-section");
const trackedSections = Array.from(document.querySelectorAll("section[id]"));
const navSectionLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const scrollIndicator = document.querySelector(".scroll-indicator");
const visualCards = Array.from(document.querySelectorAll(".visual-card"));
const journeyEye = document.querySelector(".journey-eye");
const journeyEyeCore = document.querySelector(".journey-eye-core");
const speakersSlides = Array.from(document.querySelectorAll(".speakers-slide"));
const speakersDots = Array.from(document.querySelectorAll("[data-speaker-dot]"));
const speakersPrev = document.querySelector("#speakersPrev");
const speakersNext = document.querySelector("#speakersNext");
const navHamburger = document.querySelector("#navHamburger");
const navLinksContainer = document.querySelector(".nav-links");
const newsletterForm = document.querySelector("#newsletterForm");
const navElement = document.querySelector(".nav");
let currentJourneyIndex = 0;
let journeyAutoPlay = null;
let currentSpeakersIndex = 0;

function getScrollOffset() {
  const baseOffset = window.innerWidth <= 768 ? 68 : 84;
  const navHeight = navElement ? navElement.offsetHeight : 0;
  return Math.max(baseOffset, navHeight + 12);
}

function smoothScrollToSection(targetSection) {
  const targetY = targetSection.getBoundingClientRect().top + window.pageYOffset - getScrollOffset();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const hasGsapScrollTo = Boolean(window.gsap && gsap.plugins && gsap.plugins.ScrollToPlugin);
  if (hasGsapScrollTo) {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: targetY, autoKill: true },
      ease: "power2.out"
    });
    return;
  }

  window.scrollTo({ top: targetY, behavior: "smooth" });
}

// Mobile Navigation Hamburger Menu
if (navHamburger && navLinksContainer) {
  navHamburger.addEventListener("click", () => {
    navHamburger.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
    navHamburger.setAttribute("aria-expanded", navHamburger.classList.contains("active"));
  });

  // Close menu when a link is clicked
  Array.from(navLinksContainer.querySelectorAll("a")).forEach((link) => {
    link.addEventListener("click", () => {
      navHamburger.classList.remove("active");
      navLinksContainer.classList.remove("active");
      navHamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav")) {
      navHamburger.classList.remove("active");
      navLinksContainer.classList.remove("active");
      navHamburger.setAttribute("aria-expanded", "false");
    }
  });
}

// Newsletter Form Handler
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("#newsletterEmail");
    const messageDiv = document.querySelector("#newsletterMessage");
    const email = emailInput.value.trim();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      messageDiv.textContent = "Please enter a valid email address.";
      messageDiv.classList.add("error");
      messageDiv.classList.remove("success");
      return;
    }

    // Simulate form submission (for demo purposes)
    messageDiv.textContent = "✓ Thanks for subscribing! Check your email for updates.";
    messageDiv.classList.add("success");
    messageDiv.classList.remove("error");
    emailInput.value = "";

    // Clear message after 5 seconds
    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.classList.remove("success", "error");
    }, 5000);
  });
}

revealItems.forEach((element, index) => {
  if (element.classList.contains("card")) {
    element.classList.add(index % 2 === 0 ? "reveal-left" : "reveal-right");
  } else if (element.classList.contains("highlight-card")) {
    element.classList.add(index % 2 === 0 ? "reveal-right" : "reveal-left");
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      event.preventDefault();
      smoothScrollToSection(targetSection);

      // Add slide-in animation for the target section
      gsap.fromTo(targetSection,
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power2.out"
        }
      );

      // Special animation for contact section
      if (targetId === "#contact") {
        const contactCards = targetSection.querySelectorAll(".contact-card, .location-panel");
        gsap.fromTo(contactCards,
          {
            opacity: 0,
            x: -100,
            rotationY: -15
          },
          {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 1,
            delay: 0.6,
            stagger: 0.2,
            ease: "back.out(1.7)"
          }
        );

        // Animate the map frame with a zoom effect
        const mapFrame = targetSection.querySelector(".map-frame");
        if (mapFrame) {
          gsap.fromTo(mapFrame,
            {
              scale: 0.8,
              opacity: 0,
              rotationY: 20
            },
            {
              scale: 1,
              opacity: 1,
              rotationY: 0,
              duration: 1.2,
              delay: 0.8,
              ease: "power2.out"
            }
          );
        }
      }

      // Highlight effect on target section
      gsap.to(targetSection, {
        backgroundColor: "rgba(230, 43, 30, 0.02)",
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        delay: 0.2
      });
    }
  });
});

// Replaced by GSAP ScrollTrigger in animations.js

visualCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `translateY(-8px) rotateX(${offsetY * -5}deg) rotateY(${offsetX * 7}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

function setJourneySlide(index) {
  if (!journeySlides.length) {
    return;
  }

  currentJourneyIndex = (index + journeySlides.length) % journeySlides.length;

  journeySlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentJourneyIndex);
  });

  journeyImages.forEach((image, imageIndex) => {
    image.classList.toggle("active", imageIndex === currentJourneyIndex);
  });

  journeyDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentJourneyIndex);
  });
}

function startJourneyAutoPlay() {
  if (!journeySlides.length) {
    return;
  }

  clearInterval(journeyAutoPlay);
  journeyAutoPlay = setInterval(() => {
    setJourneySlide(currentJourneyIndex + 1);
  }, 4500);
}

function stopJourneyAutoPlay() {
  clearInterval(journeyAutoPlay);
  if (journeySection) {
    journeySection.classList.add("is-paused");
  }
}

if (journeyPrev && journeyNext) {
  journeyPrev.addEventListener("click", () => {
    setJourneySlide(currentJourneyIndex - 1);
  });

  journeyNext.addEventListener("click", () => {
    setJourneySlide(currentJourneyIndex + 1);
  });

  journeyPrev.addEventListener("mouseenter", () => {
    setJourneySlide(currentJourneyIndex - 1);
  });

  journeyNext.addEventListener("mouseenter", () => {
    setJourneySlide(currentJourneyIndex + 1);
  });
}

journeyDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setJourneySlide(Number(dot.dataset.journeyDot));
  });
});

if (journeySection) {
  journeySection.addEventListener("mouseenter", stopJourneyAutoPlay);
  journeySection.addEventListener("mouseleave", startJourneyAutoPlay);
  journeySection.addEventListener("focusin", stopJourneyAutoPlay);
  journeySection.addEventListener("focusout", startJourneyAutoPlay);
}

if (trackedSections.length && navSectionLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = `#${entry.target.id}`;
        navSectionLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === activeId);
        });
      });
    },
    {
      threshold: 0.45
    }
  );

  trackedSections.forEach((section) => {
    navObserver.observe(section);
  });
}

function updateScrollIndicator() {
  if (!scrollIndicator) {
    return;
  }

  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollIndicator.style.width = `${progress}%`;
}

function applyScrollAnimations() {
  visualCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;

    // Calculate scroll progress for this card
    const scrollProgress = (viewportCenter - cardCenter) / (window.innerHeight + rect.height);

    // Parallax effect - different speeds for depth
    const parallaxOffset = scrollProgress * (30 + index * 8);

    // Staggered cards move at different speeds
    const staggeredOffset = scrollProgress * (25 * (index + 1));

    // Smooth scale effect
    const scale = 1 + scrollProgress * 0.08;

    // Cards slide in smoothly from sides based on index
    const slideX = index % 2 === 0 ? -scrollProgress * 40 : scrollProgress * 40;

    card.style.transform = `
      translateY(${parallaxOffset}px)
      translateX(${slideX}px)
      scale(${Math.max(0.92, scale)})
    `;

    // Subtle opacity change
    const opacity = Math.max(0.7, 1 - Math.abs(scrollProgress) * 0.3);
    card.style.opacity = opacity;
  });
}

window.addEventListener("scroll", () => {
  updateScrollIndicator();
  applyScrollAnimations();
}, { passive: true });

// Journey Eye Animation
if (journeyEye) {
  const journeyEyeRings = journeyEye.querySelectorAll(".journey-eye-ring");

  // Mouse tracking
  document.addEventListener("mousemove", (e) => {
    if (!journeyEye) return;

    const eyeRect = journeyEye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const angleRad = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
    const angleDeg = (angleRad * 180) / Math.PI;

    // Rotate based on mouse position
    journeyEye.style.setProperty("--eye-rotation", `${angleDeg}deg`);

    // Distance-based glow intensity
    const distX = mouseX - eyeCenterX;
    const distY = mouseY - eyeCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDistance = 500;
    const glowIntensity = Math.max(0.5, 1 - distance / maxDistance);

    journeyEyeCore.style.setProperty("--glow-intensity", glowIntensity);
  });

  // Scroll-based animation
  const applyEyeScrollAnimation = () => {
    if (!journeySection) return;

    const sectionRect = journeySection.getBoundingClientRect();
    const sectionCenter = sectionRect.top + sectionRect.height / 2;
    const viewportCenter = window.innerHeight / 2;

    const scrollProgress = (viewportCenter - sectionCenter) / (window.innerHeight + sectionRect.height);
    const rotationSpeed = scrollProgress * 45;

    journeyEyeRings.forEach((ring, index) => {
      const speed = [12, -8, 15][index] || 10;
      const rotation = (scrollProgress * speed * 180) % 360;
      ring.style.transform = `rotate(${rotation}deg)`;
    });

    // Pulse effect based on scroll
    const pulseScale = 1 + Math.sin(Date.now() * 0.003 + scrollProgress * 3) * 0.08;
    journeyEyeCore.style.setProperty("--pulse-scale", pulseScale);
  };

  window.addEventListener("scroll", applyEyeScrollAnimation, { passive: true });
}

// Speakers Carousel
function setSpeakersSlide(index) {
  if (!speakersSlides.length) return;

  currentSpeakersIndex = (index + speakersSlides.length) % speakersSlides.length;

  speakersSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSpeakersIndex);
  });

  speakersDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSpeakersIndex);
  });
}

if (speakersPrev && speakersNext) {
  speakersPrev.addEventListener("click", () => {
    setSpeakersSlide(currentSpeakersIndex - 1);
  });

  speakersNext.addEventListener("click", () => {
    setSpeakersSlide(currentSpeakersIndex + 1);
  });
}

speakersDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setSpeakersSlide(Number(dot.dataset.speakerDot));
  });
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  setJourneySlide(0);
  setSpeakersSlide(0);
  startJourneyAutoPlay();
  updateScrollIndicator();
});
