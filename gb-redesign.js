// Go Beyond redesign interactions (preview)
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function pushEvent(name, payload) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({ event: name }, payload || {}));
    }

    // Hero crossfade
    function initCrossfade(container) {
        const slides = Array.from(container.querySelectorAll('.gb-hero__slide'));
        if (slides.length === 0) return;

        const interval = parseInt(container.dataset.interval, 10) || 4500;
        let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
        let timer = null;

        function show(index) {
            slides.forEach((slide, i) => {
                const active = i === index;
                slide.classList.toggle('is-active', active);
                if (active) {
                    slide.removeAttribute('aria-hidden');
                } else {
                    slide.setAttribute('aria-hidden', 'true');
                }
            });
            current = index;
        }

        function start() {
            if (timer || slides.length < 2 || reduceMotion.matches) return;
            timer = window.setInterval(() => show((current + 1) % slides.length), interval);
        }

        function stop() {
            window.clearInterval(timer);
            timer = null;
        }

        show(current);
        start();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else start();
        });

        reduceMotion.addEventListener('change', () => {
            if (reduceMotion.matches) {
                stop();
                show(0);
            } else {
                start();
            }
        });
    }

    // Mobile header
    function initHeader() {
        const header = document.querySelector('.gb-header');
        const toggle = document.querySelector('[data-gb-nav-toggle]');
        if (!header || !toggle) return;

        function close() {
            header.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        function open() {
            header.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        toggle.addEventListener('click', () => {
            if (header.classList.contains('is-open')) close();
            else open();
        });

        header.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', close);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) close();
        });
    }

    // Learning tabs
    function initTabs(root) {
        const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
        const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
        if (!tabs.length) return;
        let activeId = null;

        function activate(tab, focus) {
            const nextId = tab.getAttribute('aria-controls');
            if (nextId === activeId) {
                if (focus) tab.focus();
                return;
            }

            tabs.forEach((t) => {
                const selected = t === tab;
                t.setAttribute('aria-selected', selected ? 'true' : 'false');
                t.tabIndex = selected ? 0 : -1;
            });

            panels.forEach((panel) => {
                const match = panel.id === nextId;
                if (match) {
                    panel.hidden = false;
                    panel.classList.remove('is-active');
                    // restart enter animation
                    void panel.offsetWidth;
                    panel.classList.add('is-active');
                } else {
                    panel.classList.remove('is-active');
                    panel.hidden = true;
                }
            });

            activeId = nextId;
            if (focus) tab.focus();
            pushEvent('learning_tab_view', { path: tab.dataset.path || tab.textContent.trim() });
        }

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => activate(tab, false));
            tab.addEventListener('keydown', (e) => {
                let next = null;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(index + 1) % tabs.length];
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(index - 1 + tabs.length) % tabs.length];
                if (e.key === 'Home') next = tabs[0];
                if (e.key === 'End') next = tabs[tabs.length - 1];
                if (next) {
                    e.preventDefault();
                    activate(next, true);
                }
            });
        });

        const initial = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
        activate(initial, false);
    }

    function animateAccordion(details, contentSelector, onOpen) {
        const summary = details.querySelector('summary');
        const content = details.querySelector(contentSelector);
        if (!summary || !content) return;

        let animating = false;

        function clearInline() {
            content.style.height = '';
            content.style.opacity = '';
            content.style.paddingBottom = '';
        }

        function openPanel() {
            details.open = true;
            if (typeof onOpen === 'function') onOpen(details);
            if (reduceMotion.matches) {
                clearInline();
                return;
            }

            animating = true;
            content.style.transition = 'none';
            content.style.height = 'auto';
            content.style.opacity = '1';
            content.style.paddingBottom = '';
            const target = content.scrollHeight;
            content.style.height = '0px';
            content.style.opacity = '0';
            content.style.paddingBottom = '0px';
            void content.offsetHeight;
            content.style.transition = '';
            content.style.height = target + 'px';
            content.style.opacity = '1';
            content.style.paddingBottom = '';

            const finish = (e) => {
                if (e && e.propertyName && e.propertyName !== 'height') return;
                clearInline();
                animating = false;
                content.removeEventListener('transitionend', finish);
            };
            content.addEventListener('transitionend', finish);
        }

        function closePanel() {
            if (reduceMotion.matches) {
                details.open = false;
                clearInline();
                return;
            }

            animating = true;
            content.style.height = content.scrollHeight + 'px';
            content.style.opacity = '1';
            void content.offsetHeight;
            content.style.height = '0px';
            content.style.opacity = '0';
            content.style.paddingBottom = '0px';

            const finish = (e) => {
                if (e && e.propertyName && e.propertyName !== 'height') return;
                details.open = false;
                clearInline();
                animating = false;
                content.removeEventListener('transitionend', finish);
            };
            content.addEventListener('transitionend', finish);
        }

        summary.addEventListener('click', (e) => {
            e.preventDefault();
            if (animating) return;
            if (details.open) closePanel();
            else openPanel();
        });
    }

    // FAQ / curriculum accordion tracking + smooth height
    function initAccordions() {
        document.querySelectorAll('[data-gb-faq] details').forEach((item) => {
            animateAccordion(item, '.gb-faq__answer', (details) => {
                const q = details.querySelector('summary')?.textContent?.trim() || '';
                pushEvent('faq_expand', { question: q });
            });
        });

        document.querySelectorAll('[data-gb-curriculum] details').forEach((item) => {
            animateAccordion(item, '.gb-accordion__body', (details) => {
                const moduleName = details.querySelector('.gb-accordion__title')?.textContent?.trim() || '';
                pushEvent('curriculum_expand', { module: moduleName });
            });
        });
    }

    // CTA analytics
    function initTracking() {
        document.querySelectorAll('[data-gb-event]').forEach((el) => {
            el.addEventListener('click', () => {
                const name = el.getAttribute('data-gb-event');
                const payload = {};
                if (el.dataset.path) payload.path = el.dataset.path;
                if (el.dataset.product) payload.product = el.dataset.product;
                if (el.dataset.founder) payload.founder = el.dataset.founder;
                pushEvent(name, payload);
            });
        });
    }

    // Smooth scroll for in-page anchors (preview doesn't rely on script.js)
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (!href || href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const header = document.querySelector('.gb-header');
                const offset = (header ? header.offsetHeight : 0) + 16;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
            });
        });
    }

    const pathCatalog = {
        marketing: {
            title: 'Marketing',
            price: '$150',
            image: '../images/marketing.png',
            imageAlt: 'Marketing path',
            description: 'For retail leaders interested in customers, brand strategy, campaigns and business growth.',
            includes: ['Foundation of Success', 'Marketing', 'Tools for a Strong Job Search'],
            learning: [
                'Understand customer personas and target audiences',
                'Connect customer insights to marketing decisions',
                'Understand brand positioning and customer experience',
                'See how marketing funnels and campaigns are structured',
                'Read common marketing KPIs and performance measures',
                'Understand how stores, e-commerce and corporate marketing connect'
            ],
            checkout: 'https://gobeyond-s-school.teachable.com/purchase?product_id=6814656',
            cta: 'Start Marketing',
            product: 'marketing'
        },
        operations: {
            title: 'Retail Operations',
            price: '$150',
            image: '../images/store_opertations.png',
            imageAlt: 'Retail Operations path',
            description: 'For people who naturally see opportunities to improve processes, performance and how the business runs.',
            includes: ['Foundation of Success', 'Retail Operations', 'Tools for a Strong Job Search'],
            learning: [
                'Think about processes beyond a single location',
                'Understand operational reporting and performance',
                'Identify problems and opportunities using business data',
                'Understand cross-functional collaboration',
                'See how operational decisions affect stores and customers',
                'Connect store-level problem solving to broader business operations'
            ],
            checkout: 'https://gobeyond-s-school.teachable.com/purchase?product_id=6814657',
            cta: 'Start Retail Operations',
            product: 'operations'
        },
        field: {
            title: 'Field Leadership',
            price: '$150',
            image: '../images/field_leadership.png',
            imageAlt: 'Field Leadership path',
            description: 'For leaders ready to expand their impact beyond a single store.',
            includes: ['Foundation of Success', 'Field Leadership', 'Tools for a Strong Job Search'],
            learning: [
                'Think beyond the performance of one store',
                'Coach and influence multiple leaders',
                'Evaluate performance across locations',
                'Balance people, execution and business priorities',
                'Communicate expectations and drive accountability',
                'Understand the shift from direct management to broader leadership'
            ],
            checkout: 'https://gobeyond-s-school.teachable.com/purchase?product_id=6814659',
            cta: 'Start Field Leadership',
            product: 'field'
        },
        full: {
            title: 'Full Go Beyond Program',
            price: '$350',
            image: '../images/corporate_success.png',
            imageAlt: 'Full Go Beyond Program',
            description: 'Want to explore all three directions? Get all five modules and understand Marketing, Retail Operations and Field Leadership before deciding where you want to focus.',
            includes: ['All five modules', 'All three specializations', 'Complete career exploration'],
            learning: [
                'Foundation of Success',
                'Marketing',
                'Retail Operations',
                'Field Leadership',
                'Tools for a Strong Job Search'
            ],
            checkout: 'https://gobeyond-s-school.teachable.com/purchase?product_id=6814675',
            cta: 'Get Full Access',
            product: 'full'
        }
    };

    function fillList(listEl, items) {
        listEl.innerHTML = '';
        items.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            listEl.appendChild(li);
        });
    }

    function initPathModal() {
        const modal = document.getElementById('gbPathModal');
        if (!modal) return;

        const titleEl = document.getElementById('gbPathModalTitle');
        const priceEl = document.getElementById('gbPathModalPrice');
        const descEl = document.getElementById('gbPathModalDesc');
        const includesEl = document.getElementById('gbPathModalIncludes');
        const learningEl = document.getElementById('gbPathModalLearning');
        const imageEl = document.getElementById('gbPathModalImage');
        const checkoutEl = document.getElementById('gbPathModalCheckout');
        const learningLabel = learningEl?.previousElementSibling;
        let lastFocus = null;

        function closeModal() {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('gb-modal-open');
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        }

        function openModal(pathKey) {
            const path = pathCatalog[pathKey];
            if (!path) return;

            titleEl.textContent = path.title;
            priceEl.textContent = path.price;
            descEl.textContent = path.description;
            fillList(includesEl, path.includes);
            fillList(learningEl, path.learning);
            if (learningLabel && learningLabel.classList.contains('gb-modal__label')) {
                learningLabel.textContent = pathKey === 'full' ? 'All five modules' : 'You’ll learn how to';
            }
            imageEl.src = path.image;
            imageEl.alt = path.imageAlt;
            checkoutEl.href = path.checkout;
            checkoutEl.textContent = path.cta;
            checkoutEl.dataset.product = path.product;

            lastFocus = document.activeElement;
            modal.hidden = false;
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('gb-modal-open');
            modal.querySelector('.gb-modal__close')?.focus();
        }

        document.querySelectorAll('[data-gb-explore]').forEach((btn) => {
            btn.addEventListener('click', () => openModal(btn.getAttribute('data-gb-explore')));
        });

        modal.querySelectorAll('[data-gb-modal-close]').forEach((el) => {
            el.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) closeModal();
        });
    }

    document.querySelectorAll('[data-hero-crossfade]').forEach(initCrossfade);
    initHeader();
    document.querySelectorAll('[data-gb-tabs]').forEach(initTabs);
    initAccordions();
    initTracking();
    initSmoothScroll();
    initPathModal();
})();
