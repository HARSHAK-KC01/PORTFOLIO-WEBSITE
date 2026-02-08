/* ============================================
   SHASHISH PORTFOLIO — MAIN SCRIPT
   Custom Cursor • 3D WebGL • GSAP Scroll
   Particles • Tilt Effects • Smooth Flow
   ============================================ */

(function () {
    'use strict';

    // ===== PAGE LOADER =====
    const loader = document.getElementById('loader');

    if (loader) {
        // Prevent scroll during loading
        document.body.style.overflow = 'hidden';
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initAllAnimations();
            }, 2200);
        });
    } else {
        // No loader (e.g. contact page) — init immediately
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initAllAnimations();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                initAllAnimations();
            });
        }
        // Safety net: force-show all animated elements after 500ms
        setTimeout(() => {
            document.querySelectorAll('[data-animate]:not(.in-view)').forEach(el => {
                el.classList.add('in-view');
            });
        }, 500);
    }

    // ===== CUSTOM CURSOR =====
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    const bgGlow = document.getElementById('bgGlow');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move bg glow (cached reference)
            if (bgGlow) {
                bgGlow.style.transform = `translate(${mouseX - 300}px, ${mouseY - 300}px)`;
            }
        });

        // Smooth cursor follow with lerp
        function animateCursor() {
            const speed = 0.15;
            const followerSpeed = 0.08;

            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            followerX += (mouseX - followerX) * followerSpeed;
            followerY += (mouseY - followerY) * followerSpeed;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor state changes on hover
        document.querySelectorAll('[data-cursor]').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                const type = el.getAttribute('data-cursor');
                cursor.className = 'cursor hover-' + type;
                follower.className = 'cursor-follower hover-' + type;
            });
            el.addEventListener('mouseleave', () => {
                cursor.className = 'cursor';
                follower.className = 'cursor-follower';
            });
        });

        // Default hover effect for links/buttons
        document.querySelectorAll('a, button').forEach((el) => {
            if (!el.hasAttribute('data-cursor')) {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover-sm');
                    follower.classList.add('hover-sm');
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hover-sm');
                    follower.classList.remove('hover-sm');
                });
            }
        });
    }

    // ===== NAVBAR SCROLL + ACTIVE NAV LINK (consolidated) =====
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    let lastScrollY = 0;
    const SCROLL_THRESHOLD = 8;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Glassmorphism background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll direction
        const scrollDelta = scrollY - lastScrollY;
        if (scrollY > 200) {
            if (scrollDelta > SCROLL_THRESHOLD) {
                navbar.classList.add('nav-hidden');
            } else if (scrollDelta < -SCROLL_THRESHOLD) {
                navbar.classList.remove('nav-hidden');
            }
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollY = scrollY;

        // Active nav link highlight
        const scrollCheck = scrollY + 200;
        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollCheck >= top && scrollCheck < top + height) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });

    // ===== HAMBURGER MENU =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== INIT ALL ANIMATIONS =====
    function initAllAnimations() {
        initHeroAnimation();
        initScrollAnimations();
        initTiltEffect();
        initParticles();
        initCarousel();
        initWebGL();
        initCardGlow();
        initSilhouette();
        initSmoothAnchorLinks();
    }

    // ===== SMOOTH ANCHOR SCROLL =====
    function initSmoothAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (!target) return;
                e.preventDefault();

                const targetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                const startY = window.scrollY;
                const diff = targetTop - startY;
                const duration = Math.min(1200, Math.max(600, Math.abs(diff) * 0.5));
                let startTime = null;

                function easeOutExpo(t) {
                    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                }

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    window.scrollTo(0, startY + diff * easeOutExpo(progress));
                    if (progress < 1) requestAnimationFrame(step);
                }

                requestAnimationFrame(step);
            });
        });
    }

    // ===== HERO TITLE ANIMATION =====
    function initHeroAnimation() {
        // Set --i CSS variable from data-i attributes (avoids inline styles)
        document.querySelectorAll('.quote-char[data-i]').forEach(el => {
            el.style.setProperty('--i', el.getAttribute('data-i'));
        });

        const words = document.querySelectorAll('.title-word');
        words.forEach((word, i) => {
            setTimeout(() => {
                word.classList.add('visible');
            }, 200 + i * 120);
        });

        // Rotating word cycle
        initRotatingWord();
    }

    function initRotatingWord() {
        const container = document.getElementById('rotateWords');
        if (!container) return;

        const words = container.querySelectorAll('.rotate-word');
        if (words.length < 2) return;

        let current = 0;
        const INTERVAL = 3200; // ms per word

        // Set initial widths
        container.style.width = words[0].offsetWidth + 'px';
        container.style.transition = 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)';

        setInterval(() => {
            const prev = current;
            current = (current + 1) % words.length;

            // Exit current word upward
            words[prev].classList.remove('active');
            words[prev].classList.add('exit-up');

            // Enter new word from below
            words[current].classList.remove('exit-up');
            words[current].classList.add('active');

            // Animate container width to fit new word
            container.style.width = words[current].offsetWidth + 'px';

            // Clean exit class after transition
            setTimeout(() => {
                words[prev].classList.remove('exit-up');
            }, 700);
        }, INTERVAL);
    }

    // ===== SCROLL-TRIGGERED ANIMATIONS (GSAP-like) =====
    function initScrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(() => {
                            entry.target.classList.add('in-view');
                        }, parseFloat(delay) * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
        );

        elements.forEach((el) => observer.observe(el));

        // Staggered reveals for grid children
        initStaggerReveal();

        // Parallax on scroll
        initScrollParallax();
    }

    // ===== STAGGERED GRID REVEALS =====
    function initStaggerReveal() {
        const grids = document.querySelectorAll('.tools-grid, .aoi-cards, .about-grid, .projects-showcase, .proj-duo-grid');

        const gridObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, i) => {
                            child.style.opacity = '0';
                            child.style.transform = 'translateY(30px)';
                            child.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    child.style.opacity = '1';
                                    child.style.transform = 'translateY(0)';
                                });
                            });
                        });
                        gridObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        grids.forEach((grid) => gridObserver.observe(grid));
    }

    // ===== SCROLL PARALLAX =====
    function initScrollParallax() {
        const orbs = document.querySelectorAll('.floating-orb');
        const bgTexts = document.querySelectorAll('.about-bg-text');
        const divider = document.querySelector('.divider-scene');

        if (orbs.length === 0 && bgTexts.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;

                    orbs.forEach((orb, i) => {
                        const speed = 0.03 + i * 0.015;
                        orb.style.transform = `translateY(${scrollY * speed}px)`;
                    });

                    bgTexts.forEach((txt) => {
                        const rect = txt.parentElement.getBoundingClientRect();
                        const visible = rect.top < window.innerHeight && rect.bottom > 0;
                        if (visible) {
                            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                            txt.style.transform = `translate(-50%, -50%) translateY(${(progress - 0.5) * -40}px)`;
                        }
                    });

                    if (divider) {
                        const rect = divider.getBoundingClientRect();
                        const visible = rect.top < window.innerHeight && rect.bottom > 0;
                        if (visible) {
                            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                            divider.style.transform = `rotateY(${progress * 360}deg)`;
                        }
                    }

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== 3D TILT EFFECT =====
    function initTiltEffect() {
        const tiltElements = document.querySelectorAll('[data-tilt]');

        tiltElements.forEach((el) => {
            const maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 8;
            let targetRotateX = 0, targetRotateY = 0;
            let currentRotateX = 0, currentRotateY = 0;
            let tiltRAF = null;

            function lerpTilt() {
                currentRotateX += (targetRotateX - currentRotateX) * 0.08;
                currentRotateY += (targetRotateY - currentRotateY) * 0.08;

                el.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(1.02,1.02,1.02)`;

                if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
                    tiltRAF = requestAnimationFrame(lerpTilt);
                }
            }

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                targetRotateX = ((y - centerY) / centerY) * -maxTilt;
                targetRotateY = ((x - centerX) / centerX) * maxTilt;

                if (!tiltRAF) tiltRAF = requestAnimationFrame(lerpTilt);
            });

            el.addEventListener('mouseleave', () => {
                targetRotateX = 0;
                targetRotateY = 0;
                if (tiltRAF) cancelAnimationFrame(tiltRAF);
                tiltRAF = null;

                // Smooth spring return
                function springBack() {
                    currentRotateX += (0 - currentRotateX) * 0.06;
                    currentRotateY += (0 - currentRotateY) * 0.06;

                    el.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(1,1,1)`;

                    if (Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
                        requestAnimationFrame(springBack);
                    } else {
                        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
                    }
                }
                requestAnimationFrame(springBack);
            });
        });
    }

    // ===== PARTICLE SYSTEM =====
    function initParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const particleCount = 60;

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction (optimized: squared distance check)
                const dx = mouseX - this.x;
                const dy = mouseY - this.y + window.scrollY;
                const distSq = dx * dx + dy * dy;
                if (distSq < 22500) { // 150²
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections between nearby particles (optimized: squared distance, no sqrt)
        const CONNECTION_DIST = 120;
        const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < CONNECTION_DIST_SQ) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - Math.sqrt(distSq) / CONNECTION_DIST)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            if (!document.hidden) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p) => {
                    p.update();
                    p.draw();
                });
                drawConnections();
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== CAROUSEL DRAG & SCROLL =====
    function initCarousel() {
        const track = document.querySelector('.carousel-track');
        if (!track) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.parentElement.offsetLeft;
            scrollLeft = track.parentElement.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.parentElement.offsetLeft;
            const walk = (x - startX) * 2;
            track.parentElement.scrollLeft = scrollLeft - walk;
        });
    }

    // ===== WEBGL 3D BACKGROUND (Three.js-inspired Vanilla WebGL) =====
    function initWebGL() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        resize();
        window.addEventListener('resize', resize);

        // Vertex Shader
        const vertSrc = `
            attribute vec2 aPosition;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        // Fragment Shader — Animated nebula/particle field
        const fragSrc = `
            precision mediump float;
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec2 uMouse;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            float fbm(vec2 p) {
                float v = 0.0;
                float a = 0.5;
                for (int i = 0; i < 5; i++) {
                    v += a * noise(p);
                    p *= 2.0;
                    a *= 0.5;
                }
                return v;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution;
                vec2 p = uv * 3.0;
                
                float t = uTime * 0.1;
                
                // Layered noise field
                float n1 = fbm(p + vec2(t, t * 0.7));
                float n2 = fbm(p * 1.5 + vec2(-t * 0.5, t * 0.3) + n1 * 0.5);
                float n3 = fbm(p * 0.8 + vec2(t * 0.2, -t * 0.1) + n2 * 0.3);
                
                // Mouse influence  
                vec2 mouse = uMouse / uResolution;
                float mouseDist = length(uv - mouse);
                float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.15;
                
                // Color mixing — dark indigo/violet
                vec3 col1 = vec3(0.04, 0.04, 0.12);  // deep dark blue
                vec3 col2 = vec3(0.15, 0.12, 0.35);   // dark violet
                vec3 col3 = vec3(0.08, 0.15, 0.30);   // dark teal
                
                vec3 color = mix(col1, col2, n2 * 0.6);
                color = mix(color, col3, n3 * 0.4);
                color += mouseInfluence * vec3(0.2, 0.15, 0.5);
                
                // Vignette
                float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
                color *= vignette * 0.8 + 0.2;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Compile shaders
        function createShader(type, src) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.warn('Shader error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vert = createShader(gl.VERTEX_SHADER, vertSrc);
        const frag = createShader(gl.FRAGMENT_SHADER, fragSrc);

        if (!vert || !frag) return;

        const program = gl.createProgram();
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.warn('Program link error');
            return;
        }

        gl.useProgram(program);

        // Full-screen quad
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, 'uTime');
        const uRes = gl.getUniformLocation(program, 'uResolution');
        const uMouse = gl.getUniformLocation(program, 'uMouse');

        let time = 0;
        let lastRenderTime = 0;
        function render(timestamp) {
            if (!lastRenderTime) lastRenderTime = timestamp;
            const dt = (timestamp - lastRenderTime) / 1000;
            lastRenderTime = timestamp;

            if (!document.hidden) {
                time += dt;
                gl.uniform1f(uTime, time);
                gl.uniform2f(uRes, canvas.width, canvas.height);
                gl.uniform2f(uMouse, mouseX, canvas.height - mouseY);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    // ===== CARD GLOW (hover light follow) =====
    function initCardGlow() {
        document.querySelectorAll('.glass-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--glow-x', x + '%');
                card.style.setProperty('--glow-y', y + '%');
            });
        });
    }

    // ===== PAGE TRANSITIONS =====
    document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"])').forEach((link) => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();
            const transition = document.querySelector('.page-transition');
            if (transition) {
                transition.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            } else {
                window.location.href = href;
            }
        });
    });

    // ===== 3D GEOMETRIC MASK FACE — FULL INTERACTIVE =====
    function initSilhouette() {
        const canvas = document.getElementById('geoMaskCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;

        // ── ADJUSTABLE SETTINGS ──────────────────────────────
        const S = {
            // Accent colors [r,g,b]
            cyan:    [0, 220, 255],
            blue:    [99, 102, 241],
            violet:  [139, 92, 246],
            // Wireframe & fill
            wireAlpha:      0.16,
            fillDark:       [8, 8, 20],
            fillMid:        [15, 15, 35],
            fillLight:      [25, 25, 55],
            // Mouse follow
            mouseSmooth:    0.10,       // faster cursor response
            maxMouseTilt:   14,         // degrees
            // Drag
            dragSmooth:     0.07,       // smoother drag catch-up
            rotSensitivity: 0.003,
            dragDecay:      0.97,       // gentler momentum decay
            // Eye tracking
            eyeTrackRange:  7,          // px pupil travel
            eyeSmooth:      0.14,       // snappier eye follow
            pupilSize:      2.5,
            irisSize:       5,
            // Blink
            blinkInterval:  [2500, 6000],  // ms range between blinks
            blinkDuration:  130,           // ms per blink (snappier)
            // Breathing
            breathAmp:      3.5,
            breathSpeed:    0.7,        // slightly slower = smoother
            breathScale:    0.004,      // subtle scale pulse
            // Idle tilt
            idleTiltAmp:    2.2,
            idleTiltSpeed:  0.25,       // slower = more organic
            // Glow
            glowPulseSpeed: 1.0,        // smoother pulse
            // Inactivity
            inactiveDelay:  3500,       // ms before reducing
            inactiveLevel:  0.35,       // reduced intensity
            inactiveSmooth: 0.035,      // faster wake-up
            // Scroll fade
            scrollFadeStart: 200,
            scrollFadeEnd:   600,
            // Particles
            particleCount:  30,
            particleSpeed:  0.35,
            // Scanlines
            scanlineAlpha:  0.012,
            scanlineSpeed:  35,         // px per second
        };
        // ─────────────────────────────────────────────────────

        // Pre-compute color strings used every frame
        const cyanStr = S.cyan.join(',');
        const blueStr = S.blue.join(',');
        const violetStr = S.violet.join(',');

        let w, h, cx, cy, sc;
        let mouseX = 0, mouseY = 0;
        let smX = 0, smY = 0;            // smoothed mouse
        let eyeTargetX = 0, eyeTargetY = 0;
        let eyeSmoothX = 0, eyeSmoothY = 0;

        // Drag
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0;
        let dragRotX = 0, dragRotY = 0;
        let tDragRotX = 0, tDragRotY = 0;
        let momX = 0, momY = 0;
        let lastDX = 0, lastDY = 0;

        // State machine: 'idle' | 'hover' | 'drag'
        let state = 'idle';
        let stateBlend = { idle: 1, hover: 0, drag: 0 };

        // Inactivity
        let lastActivity = Date.now();
        let activityLevel = 1;      // 1 = active, inactiveLevel = idle

        // Scroll
        let scrollFactor = 1;

        // Blink
        let blinkPhase = 0;         // 0 = open, 1 = closed
        let nextBlink = randomBlink();
        let blinkStart = 0;
        let isBlinking = false;

        // Floating particles
        let particles = [];

        // Time
        let time = 0;
        let dt = 0.016;
        let lastFrame = performance.now();

        function randomBlink() {
            return Date.now() + S.blinkInterval[0] + Math.random() * (S.blinkInterval[1] - S.blinkInterval[0]);
        }

        function resize() {
            w = container.offsetWidth;
            h = container.offsetHeight;
            canvas.width = w;
            canvas.height = h;
            cx = w / 2;
            cy = h / 2;
            sc = Math.min(w, h) / 700;
            initParticlesLocal();
        }

        // ── INPUT HANDLERS ───────────────────────────────────

        container.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - w / 2) / (w / 2);
            mouseY = (e.clientY - rect.top - h / 2) / (h / 2);
            // Eye target in px offset
            eyeTargetX = mouseX * S.eyeTrackRange;
            eyeTargetY = mouseY * S.eyeTrackRange;
            lastActivity = Date.now();
            if (!isDragging) state = 'hover';
        });

        container.addEventListener('mouseleave', () => {
            if (!isDragging) state = 'idle';
        });

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            state = 'drag';
            dragStartX = e.clientX; dragStartY = e.clientY;
            lastDX = e.clientX; lastDY = e.clientY;
            momX = 0; momY = 0;
            lastActivity = Date.now();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            momX = e.clientX - lastDX;
            momY = e.clientY - lastDY;
            lastDX = e.clientX; lastDY = e.clientY;
            tDragRotY = (e.clientX - dragStartX) * S.rotSensitivity;
            tDragRotX = -(e.clientY - dragStartY) * S.rotSensitivity;
            lastActivity = Date.now();
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            state = 'idle';
            tDragRotY += momX * S.rotSensitivity * 2;
            tDragRotX -= momY * S.rotSensitivity * 2;
        });

        // Touch
        container.addEventListener('touchstart', (e) => {
            isDragging = true; state = 'drag';
            dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY;
            lastDX = dragStartX; lastDY = dragStartY;
            lastActivity = Date.now();
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const t = e.touches[0];
            momX = t.clientX - lastDX; momY = t.clientY - lastDY;
            lastDX = t.clientX; lastDY = t.clientY;
            tDragRotY = (t.clientX - dragStartX) * S.rotSensitivity;
            tDragRotX = -(t.clientY - dragStartY) * S.rotSensitivity;
            // Eye track from touch
            const rect = canvas.getBoundingClientRect();
            eyeTargetX = ((t.clientX - rect.left - w / 2) / (w / 2)) * S.eyeTrackRange;
            eyeTargetY = ((t.clientY - rect.top - h / 2) / (h / 2)) * S.eyeTrackRange;
            lastActivity = Date.now();
        }, { passive: true });

        container.addEventListener('touchend', () => {
            isDragging = false; state = 'idle';
            tDragRotY += momX * S.rotSensitivity * 2;
            tDragRotX -= momY * S.rotSensitivity * 2;
        });

        // Scroll fade
        window.addEventListener('scroll', () => {
            const s = window.scrollY;
            scrollFactor = s < S.scrollFadeStart ? 1
                : s > S.scrollFadeEnd ? 0.15
                : 1 - 0.85 * ((s - S.scrollFadeStart) / (S.scrollFadeEnd - S.scrollFadeStart));
        });

        // ── FLOATING PARTICLES ───────────────────────────────

        function initParticlesLocal() {
            particles = [];
            for (let i = 0; i < S.particleCount; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * S.particleSpeed,
                    vy: (Math.random() - 0.5) * S.particleSpeed,
                    r: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.3 + 0.05,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        function updateParticles() {
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
                const flicker = 0.6 + 0.4 * Math.sin(time * 1.5 + p.phase);
                const a = p.alpha * flicker * activityLevel * scrollFactor;
                ctx.fillStyle = `rgba(${cyanStr}, ${a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * sc, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // ── 3D GEOMETRY ──────────────────────────────────────

        function getMaskVertices() {
            return [
                [0, -180, 30],     // 0  top center
                [-75, -160, 20],   // 1  top left
                [75, -160, 20],    // 2  top right
                [-120, -120, 0],   // 3  temple left
                [120, -120, 0],    // 4  temple right
                [-85, -95, 35],    // 5  brow left outer
                [-40, -90, 45],    // 6  brow left inner
                [40, -90, 45],     // 7  brow right inner
                [85, -95, 35],     // 8  brow right outer
                [-60, -65, 30],    // 9  left eye outer
                [-25, -60, 38],    // 10 left eye inner
                [25, -60, 38],     // 11 right eye inner
                [60, -65, 30],     // 12 right eye outer
                [-42, -68, 42],    // 13 left eye center
                [42, -68, 42],     // 14 right eye center
                [0, -55, 52],      // 15 nose bridge top
                [-15, -30, 55],    // 16 nose left
                [15, -30, 55],     // 17 nose right
                [0, -10, 58],      // 18 nose tip
                [-105, -50, 10],   // 19 left cheek outer
                [-70, -30, 25],    // 20 left cheek
                [70, -30, 25],     // 21 right cheek
                [105, -50, 10],    // 22 right cheek outer
                [-35, 15, 40],     // 23 mouth left
                [0, 20, 45],       // 24 mouth center
                [35, 15, 40],      // 25 mouth right
                [-95, 10, 5],      // 26 jaw left outer
                [-65, 45, 15],     // 27 jaw left
                [65, 45, 15],      // 28 jaw right
                [95, 10, 5],       // 29 jaw right outer
                [-30, 65, 30],     // 30 chin left
                [0, 75, 35],       // 31 chin center
                [30, 65, 30],      // 32 chin right
                [-40, 100, 15],    // 33 neck left
                [0, 110, 20],      // 34 neck center
                [40, 100, 15],     // 35 neck right
                [-130, 160, -10],  // 36 shoulder left
                [-60, 140, 5],     // 37 shoulder-neck left
                [60, 140, 5],      // 38 shoulder-neck right
                [130, 160, -10],   // 39 shoulder right
                [-80, -140, -40],  // 40 back left top
                [80, -140, -40],   // 41 back right top
                [-100, -60, -50],  // 42 back left mid
                [100, -60, -50],   // 43 back right mid
                [-80, 30, -40],    // 44 back left low
                [80, 30, -40],     // 45 back right low
            ];
        }

        function getMaskTriangles() {
            return [
                [0, 1, 6, 2], [0, 6, 7, 2], [0, 7, 2, 2],
                [1, 3, 5, 1], [1, 5, 6, 1],
                [2, 8, 4, 1], [2, 7, 8, 1],
                [5, 9, 6, 2], [6, 9, 10, 3], [6, 10, 15, 3],
                [6, 15, 7, 3], [7, 15, 11, 3], [7, 11, 12, 3],
                [7, 12, 8, 2],
                [10, 16, 15, 3], [15, 17, 11, 3],
                [16, 18, 17, 4], [16, 17, 15, 3],
                [5, 19, 9, 1], [9, 19, 20, 1], [9, 20, 10, 2],
                [19, 26, 20, 0], [20, 26, 23, 1],
                [8, 12, 22, 1], [12, 21, 22, 1], [11, 21, 12, 2],
                [22, 29, 21, 0], [21, 29, 25, 1],
                [20, 23, 10, 2], [10, 23, 16, 2],
                [16, 23, 24, 2], [16, 24, 18, 3],
                [18, 24, 17, 3], [17, 24, 25, 2],
                [17, 25, 11, 2], [11, 25, 21, 2],
                [26, 27, 23, 0], [23, 27, 30, 1],
                [23, 30, 24, 1], [24, 30, 31, 2],
                [24, 31, 32, 2], [24, 32, 25, 1],
                [25, 32, 28, 1], [25, 28, 29, 0],
                [30, 33, 31, 1], [31, 33, 34, 0],
                [31, 34, 35, 0], [31, 35, 32, 1],
                [32, 35, 28, 0],
                [33, 37, 34, 0], [34, 37, 38, 0], [34, 38, 35, 0],
                [36, 37, 33, 0], [35, 38, 39, 0],
                [3, 40, 42, 0], [3, 42, 19, 0], [19, 42, 44, 0], [19, 44, 26, 0],
                [4, 43, 41, 0], [4, 22, 43, 0], [22, 43, 45, 0], [22, 45, 29, 0],
                [40, 41, 0, 0], [40, 0, 1, 0], [41, 2, 0, 0],
                [40, 42, 43, 0], [40, 43, 41, 0],
                [42, 44, 45, 0], [42, 45, 43, 0],
                [44, 26, 27, 0], [44, 27, 30, 0], [44, 30, 33, 0],
                [45, 29, 28, 0], [45, 28, 32, 0], [45, 32, 35, 0],
            ];
        }

        function getMaskEdges() {
            const set = new Set(), arr = [];
            getMaskTriangles().forEach(([a, b, c]) => {
                [[a,b],[b,c],[a,c]].forEach(([i,j]) => {
                    const k = Math.min(i,j) + '-' + Math.max(i,j);
                    if (!set.has(k)) { set.add(k); arr.push([i, j]); }
                });
            });
            return arr;
        }

        const verts = getMaskVertices();
        const tris = getMaskTriangles();
        const edgeList = getMaskEdges();

        // Light direction (normalized)
        const lightDir = [0.3, -0.5, 0.8];
        const lightLen = Math.sqrt(lightDir[0]**2 + lightDir[1]**2 + lightDir[2]**2);
        lightDir[0] /= lightLen; lightDir[1] /= lightLen; lightDir[2] /= lightLen;

        // 3D math
        function rotX(v, a) { const c = Math.cos(a), s = Math.sin(a); return [v[0], v[1]*c - v[2]*s, v[1]*s + v[2]*c]; }
        function rotY(v, a) { const c = Math.cos(a), s = Math.sin(a); return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c]; }

        function proj(v) {
            const fov = 500, z = v[2] + fov;
            const ps = fov / Math.max(z, 1);
            return [v[0] * ps, v[1] * ps, v[2], ps];
        }

        // Triangle normal
        function triNormal(a, b, c) {
            const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
            const v = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
            const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
            const len = Math.sqrt(n[0]**2 + n[1]**2 + n[2]**2) || 1;
            return [n[0]/len, n[1]/len, n[2]/len];
        }

        // ── MAIN DRAW LOOP ──────────────────────────────────

        function drawFrame(now) {
            dt = Math.min((now - lastFrame) / 1000, 0.05);
            lastFrame = now;
            time += dt;

            ctx.clearRect(0, 0, w, h);

            // ── State blending ──
            const targetBlend = { idle: 0, hover: 0, drag: 0 };
            targetBlend[state] = 1;
            const blendSpeed = 6 * dt;  // faster state transitions
            stateBlend.idle += (targetBlend.idle - stateBlend.idle) * blendSpeed;
            stateBlend.hover += (targetBlend.hover - stateBlend.hover) * blendSpeed;
            stateBlend.drag += (targetBlend.drag - stateBlend.drag) * blendSpeed;

            // ── Inactivity ──
            const timeSinceActive = Date.now() - lastActivity;
            const targetActivity = timeSinceActive > S.inactiveDelay ? S.inactiveLevel : 1;
            activityLevel += (targetActivity - activityLevel) * S.inactiveSmooth;

            const intensity = scrollFactor * activityLevel;

            // ── Smooth mouse ──
            const mLerp = 1 - Math.pow(1 - S.mouseSmooth, dt * 60);  // frame-rate independent
            smX += (mouseX - smX) * mLerp;
            smY += (mouseY - smY) * mLerp;

            // ── Smooth eye tracking ──
            const targetEyeX = state === 'idle' && timeSinceActive > S.inactiveDelay
                ? Math.sin(time * 0.2) * 2  // Idle: slow wander
                : eyeTargetX;
            const targetEyeY = state === 'idle' && timeSinceActive > S.inactiveDelay
                ? Math.cos(time * 0.15) * 1.5
                : eyeTargetY;
            const eLerp = 1 - Math.pow(1 - S.eyeSmooth, dt * 60);
            eyeSmoothX += (targetEyeX - eyeSmoothX) * eLerp;
            eyeSmoothY += (targetEyeY - eyeSmoothY) * eLerp;

            // ── Drag rotation ──
            const dLerp = 1 - Math.pow(1 - S.dragSmooth, dt * 60);
            dragRotX += (tDragRotX - dragRotX) * dLerp;
            dragRotY += (tDragRotY - dragRotY) * dLerp;
            if (!isDragging) {
                const decay = Math.pow(S.dragDecay, dt * 60);
                tDragRotX *= decay;
                tDragRotY *= decay;
            }

            // ── Breathing ──
            const breathSin = Math.sin(time * S.breathSpeed * Math.PI * 2);
            const breathOffset = breathSin * S.breathAmp * intensity;
            const breathScaleVal = 1 + breathSin * S.breathScale * intensity;

            // ── Idle micro tilt ──
            const idleTX = Math.sin(time * S.idleTiltSpeed) * S.idleTiltAmp * stateBlend.idle * intensity * (Math.PI / 180);
            const idleTY = Math.cos(time * S.idleTiltSpeed * 0.7) * S.idleTiltAmp * stateBlend.idle * intensity * (Math.PI / 180);

            // ── Hover tilt ──
            const hoverTX = smY * S.maxMouseTilt * (stateBlend.hover + stateBlend.drag * 0.3) * intensity * (Math.PI / 180);
            const hoverTY = smX * S.maxMouseTilt * (stateBlend.hover + stateBlend.drag * 0.3) * intensity * (Math.PI / 180);

            const totalRX = hoverTX + idleTX + dragRotX;
            const totalRY = hoverTY + idleTY + dragRotY;

            // ── Blink logic ──
            if (!isBlinking && Date.now() > nextBlink) {
                isBlinking = true;
                blinkStart = Date.now();
            }
            if (isBlinking) {
                const elapsed = Date.now() - blinkStart;
                if (elapsed > S.blinkDuration) {
                    isBlinking = false;
                    blinkPhase = 0;
                    nextBlink = randomBlink();
                } else {
                    // Smooth close-open: goes 0→1→0
                    blinkPhase = Math.sin((elapsed / S.blinkDuration) * Math.PI);
                }
            }

            // ── Transform vertices ──
            const transformed = [];   // pre-rotation 3D coords
            const projected = [];     // screen coords
            verts.forEach(v => {
                let p = [v[0] * sc * breathScaleVal, v[1] * sc * breathScaleVal, v[2] * sc * breathScaleVal];
                p = rotX(p, totalRX);
                p = rotY(p, totalRY);
                transformed.push(p);
                const pr = proj(p);
                projected.push([pr[0] + cx, pr[1] + cy + breathOffset, pr[2], pr[3]]);
            });

            // ── Glow pulse ──
            const glowP = 0.5 + 0.5 * Math.sin(time * S.glowPulseSpeed * Math.PI);
            const glowA = (0.03 + glowP * 0.04) * intensity;

            ctx.save();

            // ── Ambient glow ──
            const ag = ctx.createRadialGradient(cx, cy + breathOffset, 0, cx, cy + breathOffset, 250 * sc);
            ag.addColorStop(0, `rgba(${blueStr}, ${glowA})`);
            ag.addColorStop(0.5, `rgba(${violetStr}, ${glowA * 0.4})`);
            ag.addColorStop(1, 'transparent');
            ctx.fillStyle = ag;
            ctx.fillRect(0, 0, w, h);

            // ── Floating particles (behind face) ──
            updateParticles();

            // ── Sort & draw triangles with dynamic lighting ──
            const sortedTris = tris.map((tri, i) => {
                const avgZ = (projected[tri[0]][2] + projected[tri[1]][2] + projected[tri[2]][2]) / 3;
                return { i, z: avgZ };
            }).sort((a, b) => a.z - b.z);

            sortedTris.forEach(({ i: idx }) => {
                const [ai, bi, ci, shade] = tris[idx];
                const pa = projected[ai], pb = projected[bi], pc = projected[ci];

                // Compute face normal for dynamic lighting
                const normal = triNormal(transformed[ai], transformed[bi], transformed[ci]);
                const dot = Math.max(0, normal[0]*lightDir[0] + normal[1]*lightDir[1] + normal[2]*lightDir[2]);

                // Base color from shade level
                const base = shade >= 3 ? S.fillLight : shade >= 1 ? S.fillMid : S.fillDark;

                // Light adds brightness
                const litR = Math.min(255, base[0] + dot * 40 + glowP * 5);
                const litG = Math.min(255, base[1] + dot * 35 + glowP * 5);
                const litB = Math.min(255, base[2] + dot * 60 + glowP * 10);
                const litA = 0.92 - dot * 0.1;

                ctx.beginPath();
                ctx.moveTo(pa[0], pa[1]);
                ctx.lineTo(pb[0], pb[1]);
                ctx.lineTo(pc[0], pc[1]);
                ctx.closePath();
                ctx.fillStyle = `rgba(${litR|0}, ${litG|0}, ${litB|0}, ${litA.toFixed(2)})`;
                ctx.fill();
            });

            // ── Wireframe ──
            ctx.lineWidth = 0.6;
            edgeList.forEach(([a, b]) => {
                const pa = projected[a], pb = projected[b];
                ctx.strokeStyle = `rgba(100, 140, 220, ${S.wireAlpha * intensity})`;
                ctx.beginPath();
                ctx.moveTo(pa[0], pa[1]);
                ctx.lineTo(pb[0], pb[1]);
                ctx.stroke();
            });

            // ── Rim light ──
            ctx.lineWidth = 0.9;
            edgeList.forEach(([a, b]) => {
                const pa = projected[a], pb = projected[b];
                const avgZ = (pa[2] + pb[2]) / 2;
                if (avgZ < -15 * sc) {
                    const rimA = Math.min(1, Math.abs(avgZ) / (100 * sc)) * 0.3 * intensity;
                    ctx.strokeStyle = `rgba(${cyanStr}, ${rimA})`;
                    ctx.beginPath();
                    ctx.moveTo(pa[0], pa[1]);
                    ctx.lineTo(pb[0], pb[1]);
                    ctx.stroke();
                }
            });

            // ── EYES — Tracked pupils + glow + blink ──
            const eyeL = projected[13];
            const eyeR = projected[14];
            const eyeOpenness = 1 - blinkPhase;  // 0 = closed, 1 = open

            [eyeL, eyeR].forEach((eye) => {
                // Pupil position offset by smooth eye tracking
                const pupilX = eye[0] + eyeSmoothX * sc;
                const pupilY = eye[1] + eyeSmoothY * sc;

                // Outer glow (always visible, fades on blink)
                const glowSize = 14 * sc * (0.6 + glowP * 0.4);
                const glowAlpha = (0.4 + glowP * 0.25) * intensity * (0.3 + eyeOpenness * 0.7);

                const eg = ctx.createRadialGradient(pupilX, pupilY, 0, pupilX, pupilY, glowSize);
                eg.addColorStop(0, `rgba(${cyanStr}, ${glowAlpha})`);
                eg.addColorStop(0.3, `rgba(${blueStr}, ${glowAlpha * 0.5})`);
                eg.addColorStop(1, 'transparent');
                ctx.fillStyle = eg;
                ctx.beginPath();
                ctx.arc(pupilX, pupilY, glowSize, 0, Math.PI * 2);
                ctx.fill();

                // Iris ring
                if (eyeOpenness > 0.1) {
                    const irisAlpha = 0.6 * intensity * eyeOpenness;
                    ctx.strokeStyle = `rgba(${cyanStr}, ${irisAlpha})`;
                    ctx.lineWidth = 1 * sc;
                    ctx.beginPath();
                    ctx.arc(pupilX, pupilY, S.irisSize * sc * eyeOpenness, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Bright pupil core
                if (eyeOpenness > 0.2) {
                    const coreAlpha = (0.7 + glowP * 0.3) * intensity * eyeOpenness;
                    ctx.fillStyle = `rgba(200, 245, 255, ${coreAlpha})`;
                    ctx.beginPath();
                    ctx.arc(pupilX, pupilY, S.pupilSize * sc * eyeOpenness, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Blink overlay (dark slit closing over eye)
                if (blinkPhase > 0.05) {
                    const blinkH = 18 * sc * blinkPhase;
                    ctx.fillStyle = `rgba(5, 5, 15, ${blinkPhase * 0.9})`;
                    ctx.beginPath();
                    ctx.ellipse(eye[0], eye[1], 16 * sc, blinkH, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // ── Nose accent ──
            const nb = projected[15], nt = projected[18];
            const ng = ctx.createLinearGradient(nb[0], nb[1], nt[0], nt[1]);
            ng.addColorStop(0, `rgba(${cyanStr}, ${0.08 * intensity})`);
            ng.addColorStop(1, 'transparent');
            ctx.strokeStyle = ng;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(nb[0], nb[1]);
            ctx.lineTo(nt[0], nt[1]);
            ctx.stroke();

            // ── Key vertex glow dots ──
            const glowVerts = [0, 3, 4, 5, 8, 18, 23, 25, 26, 29, 31, 36, 39];
            glowVerts.forEach(vi => {
                const p = projected[vi];
                const da = (0.12 + glowP * 0.08) * intensity;
                ctx.fillStyle = `rgba(${cyanStr}, ${da})`;
                ctx.beginPath();
                ctx.arc(p[0], p[1], 2 * sc, 0, Math.PI * 2);
                ctx.fill();
            });

            // ── Scanline overlay ──
            const scanY = (time * S.scanlineSpeed) % h;
            const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            scanGrad.addColorStop(0, 'transparent');
            scanGrad.addColorStop(0.5, `rgba(${cyanStr}, ${S.scanlineAlpha * intensity})`);
            scanGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(0, scanY - 30, w, 60);

            // ── Subtle horizontal scanlines (sparse for perf) ──
            if (intensity > 0.2) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.006 * intensity})`;
                for (let y = 0; y < h; y += 6) {
                    ctx.fillRect(0, y, w, 1);
                }
            }

            ctx.restore();

            if (!document.hidden) {
                requestAnimationFrame(drawFrame);
            }
        }

        // Resume when tab becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) requestAnimationFrame(drawFrame);
        });

        resize();
        window.addEventListener('resize', resize);
        requestAnimationFrame(drawFrame);
    }

})();
