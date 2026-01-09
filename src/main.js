/**
 * XTRIUM PORT - CORE SYSTEM 2026
 * Платформа: AI для обычных людей
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ЗАГРУЗКА ЗАВИСИМОСТЕЙ ---
    const loadDependencies = async () => {
        const libs = [
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
            'https://unpkg.com/split-type',
            'https://unpkg.com/lucide@latest'
        ];

        for (const src of libs) {
            await new Promise(resolve => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
        
        // Старт системы после загрузки всех скриптов
        initCore();
    };

    function initCore() {
        lucide.createIcons();
        gsap.registerPlugin(ScrollTrigger);

        initHeader();
        initMobileMenu();
        initHero();
        initScrollAnimations();
        initGlowCards();
        initFloatTools();
        initContactForm();
        initCookies();
    }

    // --- 2. ХЕДЕР И МОБИЛЬНОЕ МЕНЮ ---
    function initHeader() {
        const headerWrapper = document.querySelector('.header__wrapper');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                headerWrapper.style.padding = '8px 24px';
                headerWrapper.style.background = 'rgba(255, 255, 255, 0.95)';
                headerWrapper.style.boxShadow = '0 15px 50px rgba(5, 10, 31, 0.12)';
            } else {
                headerWrapper.style.padding = '12px 32px';
                headerWrapper.style.background = 'rgba(255, 255, 255, 0.85)';
                headerWrapper.style.boxShadow = '0 10px 40px rgba(5, 10, 31, 0.05)';
            }
        });
    }

    function initMobileMenu() {
        const burger = document.getElementById('burger');
        const menu = document.getElementById('mobile-menu');
        const links = document.querySelectorAll('.mobile-menu__link');

        if (!burger || !menu) return;

        const toggleMenu = () => {
            burger.classList.toggle('is-active');
            menu.classList.toggle('is-active');
            document.body.style.overflow = menu.classList.contains('is-active') ? 'hidden' : '';
        };

        burger.addEventListener('click', toggleMenu);
        links.forEach(link => link.addEventListener('click', toggleMenu));
    }

    // --- 3. ГЛАВНАЯ СЕКЦИЯ (HERO) ---
    function initHero() {
        const heroTitle = document.querySelector('#hero-title');
        if (!heroTitle) return;

        // Разделяем текст (words — чтобы не разрывались слова, chars — для анимации букв)
        const text = new SplitType(heroTitle, { types: 'words, chars' });
        
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.to('.reveal', { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            stagger: 0.1, 
            delay: 0.3 
        })
        .from(text.chars, { 
            opacity: 0, 
            y: 30, 
            rotateX: -90, 
            stagger: 0.02, 
            duration: 1 
        }, "-=0.8");

        // Интерактив карточки в Hero
        const card = document.querySelector('.hero__card');
        if (card) {
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                gsap.to(card, { 
                    rotationY: x, 
                    rotationX: -y, 
                    duration: 1, 
                    ease: "power2.out" 
                });
            });
        }
    }

    // --- 4. АНИМАЦИИ ПРИ СКРОЛЛЕ ---
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal-scroll');
        
        revealElements.forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            });
        });
    }

    // --- 5. ЭФФЕКТ СВЕЧЕНИЯ (GLOW) ---
    function initGlowCards() {
        const cards = document.querySelectorAll('.about-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    }

    // --- 6. ИННОВАЦИИ (ЛЕВИТАЦИЯ И ПАРАЛЛАКС) ---
    function initFloatTools() {
        const tools = document.querySelectorAll('.float-el');
        const wrapper = document.querySelector('.innovations__wrapper');

        // Постоянное парение
        tools.forEach((tool, i) => {
            gsap.to(tool, {
                y: "random(-15, 15)",
                x: "random(-10, 10)",
                duration: `random(2, 4)`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.1
            });
        });

        // Параллакс за мышкой
        if (wrapper && window.innerWidth > 992) {
            wrapper.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 40;
                const y = (e.clientY / window.innerHeight - 0.5) * 40;
                tools.forEach(tool => {
                    const speed = tool.dataset.speed || 2;
                    gsap.to(tool, {
                        x: x * (speed / 5),
                        y: y * (speed / 5),
                        duration: 1
                    });
                });
            });
        }
    }

    // --- 7. ФОРМА КОНТАКТОВ И КАПЧА ---
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const phone = document.getElementById('phone-input');
        const q = document.getElementById('captcha-question');
        const a = document.getElementById('captcha-answer');
        const success = document.getElementById('form-success');

        if (!form) return;

        // Генерация примера
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * 9) + 1;
        const sum = n1 + n2;
        if (q) q.innerText = `${n1} + ${n2}`;

        // Только цифры в телефоне
        phone.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (parseInt(a.value) !== sum) {
                alert('Ошибка: Решите пример правильно.');
                return;
            }

            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Интеграция...';
            btn.disabled = true;

            // Имитация отправки
            setTimeout(() => {
                gsap.to(form.querySelectorAll('.form__group, .form__captcha, .form__consent, .btn'), {
                    opacity: 0,
                    y: -20,
                    stagger: 0.1,
                    onComplete: () => {
                        success.style.display = 'flex';
                        gsap.fromTo(success, 
                            { opacity: 0, scale: 0.8 }, 
                            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out" }
                        );
                        lucide.createIcons();
                    }
                });
            }, 1500);
        });
    }

    // --- 8. COOKIES ---
    function initCookies() {
        const popup = document.getElementById('cookie-popup');
        const accept = document.getElementById('cookie-accept');

        if (!popup || !accept) return;

        if (!localStorage.getItem('xtrium_cookies')) {
            setTimeout(() => {
                popup.classList.add('is-visible');
            }, 3000);
        }

        accept.addEventListener('click', () => {
            localStorage.setItem('xtrium_cookies', 'true');
            popup.classList.remove('is-visible');
        });
    }

    // ЗАПУСК ЗАГРУЗКИ
    loadDependencies();
});