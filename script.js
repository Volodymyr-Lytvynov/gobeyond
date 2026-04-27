// Course data
const courseData = {
    'corporate-leadership': {
        title: 'Corporate Field Leadership',
        subtitle: 'From Store Manager to District/Regional Manager',
        overview: 'Transform your store management experience into corporate leadership excellence. This comprehensive program prepares retail professionals for district and regional management roles through strategic thinking, team leadership, and operational optimization.',
        learning: [
            'Strategic planning and execution for multi-unit operations',
            'Advanced team leadership and performance management',
            'Financial analysis and budget management',
            'Cross-functional collaboration and communication',
            'Change management and organizational development',
            'Data-driven decision making and KPI optimization'
        ],
        lessons: '50 lessons across 10 chapters'
    },
    'retail-operations': {
        title: 'Retail Operations',
        subtitle: 'Master processes, reporting, and cross-functional innovation',
        overview: 'Master the art of retail operations excellence. Learn to optimize processes, implement innovative solutions, and drive operational efficiency across multiple channels and touchpoints.',
        learning: [
            'Process optimization and workflow design',
            'Inventory management and supply chain coordination',
            'Performance metrics and reporting systems',
            'Technology integration and digital transformation',
            'Customer experience optimization',
            'Cross-functional project management'
        ],
        lessons: '52 lessons across 10 chapters'
    },
    'marketing': {
        title: 'Marketing',
        subtitle: 'Use customer insights to shape product strategy',
        overview: 'Bridge the gap between retail operations and marketing strategy. Learn to leverage customer data and insights to drive product development, brand positioning, and customer engagement strategies.',
        learning: [
            'Customer analytics and segmentation',
            'Brand positioning and messaging',
            'Digital marketing and social media strategy',
            'Product development and merchandising',
            'Customer journey mapping and experience design',
            'Marketing campaign planning and execution'
        ],
        lessons: '63 lessons across 10 chapters'
    },
    'foundation': {
        title: 'Foundation of Success',
        subtitle: 'Build the core skills needed for corporate leadership',
        overview: 'Establish the fundamental skills and mindset required for corporate leadership success. This foundational course covers essential leadership principles, communication, and strategic thinking.',
        learning: [
            'Leadership principles and emotional intelligence',
            'Effective communication and presentation skills',
            'Strategic thinking and problem-solving',
            'Time management and productivity',
            'Professional networking and relationship building',
            'Career planning and goal setting'
        ],
        lessons: '26 lessons across 5 chapters'
    },
    'land-job': {
        title: 'Tools for a Strong Job Search',
        subtitle: 'Master the interview process and negotiation skills',
        overview: 'This module gives you practical tools to strengthen your job search. You’ll learn how to build a strong resume, improve your LinkedIn presence, expand your network, prepare for interviews, and stay organized throughout the process.',
        learning: [
            'How to create a clear and effective resume',
            'How to optimize your LinkedIn profile',
            'How to build and grow your network',
            'How to prepare for interviews with confidence',
            'How to stay organized during your job search',
            'How to use AI to support your overall strategy'
        ],
        lessons: '6 lessons'
    }
};

const NL_STORAGE_SUBSCRIBED = 'gb_newsletter_subscribed';
const NL_SESSION_DISMISSED = 'gb_nl_dismissed';
const NL_SESSION_AUTO_SHOWN = 'gb_nl_modal_shown';
const NL_SESSION_FLOAT_SENT = 'gb_nl_float_click_sent';
const NL_SESSION_CONVERSION = 'gb_nl_conversion_sent';

function isNewsletterSubscribed() {
    try {
        return localStorage.getItem(NL_STORAGE_SUBSCRIBED) === 'true';
    } catch (e) {
        return false;
    }
}

function markNewsletterSubscribed() {
    try {
        localStorage.setItem(NL_STORAGE_SUBSCRIBED, 'true');
    } catch (e) { /* ignore */ }
}

function trackNewsletterLead(source) {
    var key = NL_SESSION_CONVERSION + '_' + source;
    try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
    } catch (e) { /* still fire events */ }

    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
            event_category: 'newsletter',
            source: source
        });
    }
    if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
            content_name: 'newsletter',
            source: source
        });
    }
}

function trackNewsletterFloatClick() {
    try {
        if (sessionStorage.getItem(NL_SESSION_FLOAT_SENT)) return;
        sessionStorage.setItem(NL_SESSION_FLOAT_SENT, '1');
    } catch (e) { /* ignore */ }

    if (typeof gtag === 'function') {
        gtag('event', 'newsletter_float_click', {
            event_category: 'newsletter',
            source: 'floating_button'
        });
    }
    if (typeof fbq === 'function') {
        fbq('trackCustom', 'NewsletterFloatClick', { source: 'floating_button' });
    }
}

function wireKitFormSuccess(container, source) {
    if (!container || typeof MutationObserver === 'undefined') return;
    var fired = false;
    var obs = new MutationObserver(function() {
        if (fired) return;
        var ok = container.querySelector('.formkit-alert-success');
        if (ok && ok.textContent && ok.textContent.trim().length > 0) {
            fired = true;
            obs.disconnect();
            markNewsletterSubscribed();
            trackNewsletterLead(source);
            var floatBtn = document.getElementById('newsletterFloatBtn');
            if (floatBtn) floatBtn.classList.add('is-hidden-subscribed');
            try {
                sessionStorage.setItem(NL_SESSION_AUTO_SHOWN, '1');
            } catch (e) { /* ignore */ }
        }
    });
    obs.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
}

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const courseModal = document.getElementById('courseModal');
    const leadModal = document.getElementById('leadModal');
    const closeBtns = document.querySelectorAll('.close');
    const courseCards = document.querySelectorAll('.course-card');

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
            document.body.style.overflow = navMenu.classList.contains('mobile-open') ? 'hidden' : 'auto';
        });

        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-open');
                document.body.style.overflow = 'auto';
            });
        });

        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-open');
                document.body.style.overflow = 'auto';
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var header = document.querySelector('.header');
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Open modal when course card is clicked; links have real href for GTM/Click URL
    courseCards.forEach(card => {
        card.addEventListener('click', function (e) {
            const inLearnMore = e.target.closest('a.btn-course');
            const openInNewTab =
                e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey;
            if (inLearnMore && openInNewTab) {
                return;
            }
            if (inLearnMore) {
                e.preventDefault();
            }
            const courseId = this.getAttribute('data-course');
            const linkUrl = this.getAttribute('data-url') || '';
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'gb_course_learn_more',
                link_url: linkUrl,
                course_id: courseId
            });
            openModal(courseId);
        });
    });

    function closeCourseModal() {
        if (!courseModal) return;
        courseModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function closeNewsletterModal() {
        if (!leadModal) return;
        leadModal.style.display = 'none';
        leadModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        try {
            sessionStorage.setItem(NL_SESSION_DISMISSED, '1');
        } catch (e) { /* ignore */ }
    }

    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (courseModal && courseModal.style.display === 'block') {
                closeCourseModal();
            }
            if (leadModal && leadModal.style.display === 'block') {
                closeNewsletterModal();
            }
        });
    });

    window.addEventListener('click', function(event) {
        if (courseModal && event.target === courseModal) {
            closeCourseModal();
        }
        if (leadModal && event.target === leadModal) {
            closeNewsletterModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key !== 'Escape') return;
        if (courseModal && courseModal.style.display === 'block') {
            closeCourseModal();
        }
        if (leadModal && leadModal.style.display === 'block') {
            closeNewsletterModal();
        }
    });

    function openModal(courseId) {
        var course = courseData[courseId];
        if (!course || !courseModal) return;

        document.querySelector('.modal-title').textContent = course.title;
        document.querySelector('.modal-subtitle').textContent = course.subtitle;
        document.querySelector('.modal-overview').textContent = course.overview;
        document.querySelector('.modal-lessons').textContent = course.lessons;

        var modalImage = document.querySelector('.modal-image');
        var courseCard = document.querySelector('[data-course="' + courseId + '"]');
        if (courseCard && modalImage) {
            var courseCardImage = courseCard.querySelector('.course-image img');
            if (courseCardImage) {
                modalImage.style.backgroundImage = 'url(' + courseCardImage.src + ')';
                modalImage.style.backgroundSize = 'cover';
                modalImage.style.backgroundPosition = 'center';
            }
        }

        var learningList = document.querySelector('.modal-learning-list');
        learningList.innerHTML = '';
        course.learning.forEach(function(item) {
            var li = document.createElement('li');
            li.textContent = item;
            learningList.appendChild(li);
        });

        courseModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    var newsletterFormWrap = document.getElementById('newsletterModalFormWrap');

    function resetNewsletterModalToForm() {
        if (newsletterFormWrap) newsletterFormWrap.hidden = false;
    }

    function openNewsletterModal() {
        if (!leadModal || isNewsletterSubscribed()) return;
        resetNewsletterModalToForm();
        leadModal.style.display = 'block';
        leadModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    window.openNewsletterModal = openNewsletterModal;

    if (newsletterFormWrap) {
        wireKitFormSuccess(newsletterFormWrap, 'popup');
    }

    var floatBtn = document.getElementById('newsletterFloatBtn');
    if (floatBtn && leadModal) {
        if (isNewsletterSubscribed()) {
            floatBtn.classList.add('is-hidden-subscribed');
        }
        floatBtn.addEventListener('click', function() {
            trackNewsletterFloatClick();
            if (isNewsletterSubscribed()) {
                window.location.href = 'newsletter.html';
                return;
            }
            openNewsletterModal();
        });

        function onScrollFloat() {
            if (isNewsletterSubscribed()) return;
            if (window.scrollY > 200) {
                floatBtn.classList.add('is-visible');
            } else {
                floatBtn.classList.remove('is-visible');
            }
        }
        window.addEventListener('scroll', onScrollFloat, { passive: true });
        onScrollFloat();
    }

    function shouldShowAutoPopup() {
        if (isNewsletterSubscribed()) return false;
        try {
            if (sessionStorage.getItem(NL_SESSION_DISMISSED)) return false;
            if (sessionStorage.getItem(NL_SESSION_AUTO_SHOWN)) return false;
        } catch (e) {
            return true;
        }
        return true;
    }

    function tryAutoOpenNewsletter() {
        if (!shouldShowAutoPopup() || !leadModal) return;
        try {
            sessionStorage.setItem(NL_SESSION_AUTO_SHOWN, '1');
        } catch (e) { /* ignore */ }
        openNewsletterModal();
    }

    if (leadModal) {
        var isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            var scrollFired = false;
            function onScrollDepth() {
                if (scrollFired || !shouldShowAutoPopup()) return;
                var doc = document.documentElement;
                var scrollable = doc.scrollHeight - window.innerHeight;
                if (scrollable <= 0) return;
                var pct = (window.scrollY / scrollable) * 100;
                if (pct >= 45) {
                    scrollFired = true;
                    window.removeEventListener('scroll', onScrollDepth);
                    tryAutoOpenNewsletter();
                }
            }
            window.addEventListener('scroll', onScrollDepth, { passive: true });
        } else {
            var delayMs = 8000 + Math.floor(Math.random() * 4001);
            var onExitIntent = function(e) {
                if (e.clientY > 0) return;
                if (!shouldShowAutoPopup()) return;
                clearTimeout(timerId);
                document.removeEventListener('mouseout', onExitIntent);
                tryAutoOpenNewsletter();
            };
            var timerId = setTimeout(function() {
                document.removeEventListener('mouseout', onExitIntent);
                if (shouldShowAutoPopup()) {
                    tryAutoOpenNewsletter();
                }
            }, delayMs);
            document.addEventListener('mouseout', onExitIntent);
        }
    }

    var urlParams = new URLSearchParams(window.location.search);

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        if (urlParams.get('success') === 'true') {
            alert('Thank you for your message! We\'ll respond within 2 business days.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    var btnModalPrimary = document.querySelector('.btn-modal-primary');
    if (btnModalPrimary) {
        btnModalPrimary.addEventListener('click', function() {
            alert('Enrollment process would start here!');
        });
    }

    initNewsletterLandingPage();
});

function initNewsletterLandingPage() {
    var page = document.getElementById('newsletterPage');
    if (!page) return;

    var signupBlock = document.getElementById('newsletter-signup');
    if (signupBlock) {
        wireKitFormSuccess(signupBlock, 'newsletter_landing');
    }

    var params = new URLSearchParams(window.location.search);
    if (params.get('thanks') === '1' || params.get('success') === 'true') {
        markNewsletterSubscribed();
        trackNewsletterLead('newsletter_landing');
        showLandingSuccess();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    function showLandingSuccess() {
        document.querySelectorAll('.newsletter-hide-on-success').forEach(function(el) {
            el.hidden = true;
        });
        var success = document.getElementById('newsletterLandingSuccess');
        if (success) success.hidden = false;
    }
}
