// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // 0. SMOOTH SCROLLING (LENIS)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
        const lenis = new Lenis({
            duration: window.innerWidth <= 768 ? 0.9 : 1.1,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: true,
            mouseMultiplier: 1,
            touchMultiplier: 1.15,
            wheelMultiplier: 0.95
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 1. PRELOADER
    const preloader = document.querySelector(".preloader");
    const preloaderBar = document.querySelector(".preloader-progress-bar");
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        preloaderBar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(progressInterval);
            completePreloader();
        }
    }, 50);

    function completePreloader() {
        gsap.to(preloader, {
            y: "-100%",
            duration: 1,
            ease: "power4.inOut",
            delay: 0.2,
            onComplete: () => {
                preloader.remove();
                initHeroAnimations();
            }
        });

        // Fade in body
        gsap.to(document.body, { opacity: 1, duration: 0.5 });
    }

    // 2. CUSTOM CURSOR & AMBIENT ORB
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");
    const ambientOrb = document.querySelector(".ambient-orb");
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant dot tracking
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Smooth outline tracking
        cursorOutline.animate({
            left: `${mouseX}px`,
            top: `${mouseY}px`
        }, { duration: 500, fill: "forwards" });

        // Ambient Orb tracking (slow float)
        ambientOrb.animate({
            left: `${mouseX}px`,
            top: `${mouseY}px`
        }, { duration: 3000, fill: "forwards", easing: "ease-out" });
    });

    // Hover states for cursor
    const interactiveElements = document.querySelectorAll("a, button, .card, .visual-card");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => cursorOutline.classList.add("hover"));
        el.addEventListener("mouseleave", () => cursorOutline.classList.remove("hover"));
    });

    // Flashlight Glow Hover for Cards
    const glowCards = document.querySelectorAll(".card, .speaker-card, .highlight-card");
    glowCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 3. MAGNETIC BUTTONS
    const magneticBtns = document.querySelectorAll(".btn, .nav-btn");
    magneticBtns.forEach(btn => {
        btn.addEventListener("mousemove", function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener("mouseleave", function(e) {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 4. GSAP ANIMATIONS
    function initHeroAnimations() {
        // Split typography for hero
        const heroTitle = new SplitType('.hero-content h1', { types: 'words, chars' });
        const heroTagline = new SplitType('.tagline', { types: 'words' });
        
        const tl = gsap.timeline();
        
        tl.from(".nav", {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
        .from(heroTitle.chars, {
            y: 100,
            opacity: 0,
            rotationX: -90,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.5)"
        }, "-=0.5")
        .from(heroTagline.words, {
            y: 20,
            opacity: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5")
        .from(".hero-actions .btn", {
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "back.out(1.5)"
        }, "-=0.4")
        .from(".hero-stat", {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6");
        
        // Hero Art Floating Parallax
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            
            gsap.to(".hero-art-frame", {
                x: x,
                y: y,
                rotationY: x * 0.5,
                rotationX: -y * 0.5,
                duration: 1,
                ease: "power2.out"
            });
        });
        
        initScrollAnimations();
    }

    function initScrollAnimations() {
        // Staggered reveals for Sections via ScrollTrigger
        const sections = document.querySelectorAll("section h2");
        sections.forEach(sec => {
            const splitSection = new SplitType(sec, { types: 'chars' });
            gsap.from(splitSection.chars, {
                scrollTrigger: {
                    trigger: sec,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                rotationX: -90,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.2)"
            });
        });

        // 3D Reveal for speaker cards
        gsap.utils.toArray(".speaker-card").forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 100,
                opacity: 0,
                rotationY: 30,
                scale: 0.9,
                duration: 1,
                delay: i % 2 === 0 ? 0 : 0.2,
                ease: "power3.out"
            });
        });

        // Highlights Stagger
        gsap.from(".highlight-card", {
            scrollTrigger: {
                trigger: ".highlight-grid",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "back.out(1.2)"
        });

        // Visual Cards Parallax ScrollTrigger
        gsap.utils.toArray(".visual-card").forEach((card, i) => {
            gsap.fromTo(card,
                { y: 100, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        end: "bottom 20%",
                        scrub: 1
                    },
                    y: -50,
                    opacity: 1,
                    ease: "none"
                }
            );
        });
        
        // Scale Event Bar on Scroll
        gsap.to(".event-bar", {
            scrollTrigger: {
                trigger: ".hero",
                start: "bottom 90%",
                end: "bottom top",
                scrub: true
            },
            scale: 1.1,
            opacity: 0.5,
            y: 50
        });
    }

    // --- PROCEDURAL WEB AUDIO HAPTICS ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function playHapticHover() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
        
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); /* Extremely subtle */
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    }

    function playHapticClick() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    // Initialize audio on first user interaction (browser policy)
    document.body.addEventListener('pointerdown', initAudio, { once: true });
    document.body.addEventListener('keydown', initAudio, { once: true });

    // Bind procedural Haptics
    const hapticElements = document.querySelectorAll('a, button, .btn, .card, .speaker-card');
    hapticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playHapticHover();
        });
        el.addEventListener('click', () => {
            playHapticClick();
        });
    });

});
