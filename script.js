/* ========================================
   NILESH KALE - PORTFOLIO
   JavaScript & Three.js 3D Scene
   ======================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initRevealAnimations();
    initContactForm();
    init3DScene();
});

/* ========================================
   NAVIGATION
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = navLinks.querySelectorAll('.nav-link');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   REVEAL ANIMATIONS
   CSS-based scroll animations that keep elements visible
   ======================================== */
function initRevealAnimations() {
    // Inject CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .scroll-reveal {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .scroll-reveal.reveal-hidden {
            opacity: 0;
            transform: translateY(40px);
        }
        .scroll-reveal.reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .scroll-reveal:nth-child(1) { transition-delay: 0s; }
        .scroll-reveal:nth-child(2) { transition-delay: 0.1s; }
        .scroll-reveal:nth-child(3) { transition-delay: 0.2s; }
        .scroll-reveal:nth-child(4) { transition-delay: 0.3s; }
        .scroll-reveal:nth-child(5) { transition-delay: 0.4s; }
    `;
    document.head.appendChild(style);

    // Select elements to animate
    const revealElements = document.querySelectorAll(
        '.service-card, .portfolio-card, .testimonial-card, .section-header, .about-grid, .contact-wrapper'
    );

    // Add classes to elements
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        // Only hide if element is below the viewport initially
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            el.classList.add('reveal-hidden');
        }
    });

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('reveal-hidden');
                entry.target.classList.add('reveal-visible');
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    // Observe only hidden elements
    document.querySelectorAll('.scroll-reveal.reveal-hidden').forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   CONTACT FORM
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="40" stroke-dashoffset="10">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success
        submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
        `;
        submitBtn.style.background = '#22c55e';

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });
}

/* ========================================
   THREE.JS 3D SCENE
   Lightweight floating particles/shapes
   ======================================== */
function init3DScene() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Check for low-end devices
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'low-power'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));

    // Particle count based on device capability
    const particleCount = isLowEnd || isMobile ? 50 : 150;

    // Create particles
    const particles = [];
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color palette (matching CSS accent colors)
    const colorPalette = [
        new THREE.Color(0x8b5cf6), // Purple
        new THREE.Color(0xec4899), // Pink
        new THREE.Color(0xf97316), // Orange
        new THREE.Color(0xa78bfa), // Light purple
    ];

    for (let i = 0; i < particleCount; i++) {
        // Random positions in a large sphere
        const radius = 15 + Math.random() * 25;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Random color from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Store particle data for animation
        particles.push({
            index: i,
            speed: 0.2 + Math.random() * 0.3,
            offset: Math.random() * Math.PI * 2
        });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.08 : 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Add some floating geometric shapes
    const shapes = [];
    const shapeCount = isLowEnd || isMobile ? 3 : 6;

    for (let i = 0; i < shapeCount; i++) {
        let geometry;
        const shapeType = Math.floor(Math.random() * 3);

        switch (shapeType) {
            case 0:
                geometry = new THREE.IcosahedronGeometry(0.5 + Math.random() * 0.5, 0);
                break;
            case 1:
                geometry = new THREE.OctahedronGeometry(0.5 + Math.random() * 0.5, 0);
                break;
            default:
                geometry = new THREE.TetrahedronGeometry(0.5 + Math.random() * 0.5, 0);
        }

        const material = new THREE.MeshBasicMaterial({
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Random position
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 15;
        mesh.position.z = (Math.random() - 0.5) * 10 - 10;

        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        shapes.push({
            mesh: mesh,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: 0.3 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2
        });

        scene.add(mesh);
    }

    // Camera position
    camera.position.z = 20;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        targetMouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    // Scroll-based effects
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation loop
    let time = 0;
    let animationId;

    function animate() {
        animationId = requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate particle system
        particleSystem.rotation.y = time * 0.05 + mouseX * 0.5;
        particleSystem.rotation.x = mouseY * 0.3;

        // Animate shapes
        shapes.forEach((shape, i) => {
            shape.mesh.rotation.x += shape.rotationSpeed.x;
            shape.mesh.rotation.y += shape.rotationSpeed.y;
            shape.mesh.rotation.z += shape.rotationSpeed.z;

            // Float animation
            shape.mesh.position.y += Math.sin(time * shape.floatSpeed + shape.floatOffset) * 0.005;
        });

        // Fade out on scroll
        const scrollFade = Math.max(0, 1 - scrollY / 600);
        particleSystem.material.opacity = 0.8 * scrollFade;
        shapes.forEach(shape => {
            shape.mesh.material.opacity = 0.15 * scrollFade;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
        renderer.dispose();
    });

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ========================================
   GSAP ANIMATIONS (if loaded)
   Scroll effects that enhance but don't hide content
   ======================================== */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Wait for page to fully load
    window.addEventListener('load', () => {
        // Hero section parallax
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 100,
            opacity: 0.3
        });

        // Section headers - subtle slide up on scroll
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                y: 30,
                duration: 0.8,
                ease: 'power2.out'
            });
        });

        // About section image - subtle scale
        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            scale: 0.95,
            duration: 1,
            ease: 'power2.out'
        });

        // Contact section - slide in
        gsap.from('.contact-form-wrapper', {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            x: 50,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.from('.contact-content', {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            x: -50,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
    });
}

