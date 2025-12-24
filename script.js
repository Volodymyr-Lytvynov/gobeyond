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

// Lead capture data
const leadCaptureData = {
    'career-quiz': {
        title: "What's Your Best Corporate Move?",
        subtitle: "Take our 3-question Career Roadmap Quiz and discover which corporate path fits your retail experience",
        buttonText: "Take the Quiz"
    },
    'insider-guide': {
        title: "5 Things Corporate Hiring Managers Wish You Knew",
        subtitle: "Get insider strategies from former retail leaders who've made the transition to corporate roles",
        buttonText: "Get Free Guide"
    },
    'resume-template': {
        title: "Your Corporate-Ready Resume Starts Here",
        subtitle: "Download our proven resume template pack designed specifically for retail-to-corporate transitions",
        buttonText: "Download Templates"
    },
    'mini-class': {
        title: "From Store Manager to Corporate: Your First Step",
        subtitle: "Watch our free 30-minute preview class and learn the first steps to corporate success",
        buttonText: "Watch Free Preview"
    },
    'success-checklist': {
        title: "Are You Ready for Corporate?",
        subtitle: "Get our comprehensive readiness checklist to assess your corporate career readiness",
        buttonText: "Get Checklist"
    }
};

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const courseModal = document.getElementById('courseModal');
    const leadModal = document.getElementById('leadModal');
    const closeBtns = document.querySelectorAll('.close');
    const courseCards = document.querySelectorAll('.course-card');
    
    // Mobile navigation functionality
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
            document.body.style.overflow = navMenu.classList.contains('mobile-open') ? 'hidden' : 'auto';
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-open');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-open');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Open modal when course card is clicked
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            openModal(courseId);
        });
    });

    // Close modals when close buttons are clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (courseModal.style.display === 'block') {
                closeCourseModal();
            }
            if (leadModal.style.display === 'block') {
                closeLeadModal();
            }
        });
    });

    // Close modals when clicking outside of them
    window.addEventListener('click', function(event) {
        if (event.target === courseModal) {
            closeCourseModal();
        }
        if (event.target === leadModal) {
            closeLeadModal();
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (courseModal.style.display === 'block') {
                closeCourseModal();
            }
            if (leadModal.style.display === 'block') {
                closeLeadModal();
            }
        }
    });

    function openModal(courseId) {
        const course = courseData[courseId];
        if (!course) return;

        // Populate modal content
        document.querySelector('.modal-title').textContent = course.title;
        document.querySelector('.modal-subtitle').textContent = course.subtitle;
        document.querySelector('.modal-overview').textContent = course.overview;
        document.querySelector('.modal-lessons').textContent = course.lessons;

        // Set modal image to match course card image
        const modalImage = document.querySelector('.modal-image');
        const courseCard = document.querySelector(`[data-course="${courseId}"]`);
        if (courseCard) {
            const courseCardImage = courseCard.querySelector('.course-image img');
            if (courseCardImage) {
                modalImage.style.backgroundImage = `url(${courseCardImage.src})`;
                modalImage.style.backgroundSize = 'cover';
                modalImage.style.backgroundPosition = 'center';
            }
        }

        // Populate learning list
        const learningList = document.querySelector('.modal-learning-list');
        learningList.innerHTML = '';
        course.learning.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            learningList.appendChild(li);
        });

        // Show modal
        courseModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeCourseModal() {
        courseModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    function openLeadModal(leadType) {
        const lead = leadCaptureData[leadType];
        if (!lead) return;

        // Populate lead modal content
        document.querySelector('.lead-title').textContent = lead.title;
        document.querySelector('.lead-subtitle').textContent = lead.subtitle;
        document.querySelector('.btn-lead-submit').textContent = lead.buttonText;
        
        // Set the lead type for tracking
        document.getElementById('leadType').value = leadType;

        // Show modal
        leadModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeLeadModal() {
        leadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Modal button functionality
    document.querySelector('.btn-modal-primary').addEventListener('click', function() {
        alert('Enrollment process would start here!');
    });

    // Lead capture form functionality - now uses FormSubmit
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        // Check if lead form was successfully submitted
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            alert('Thank you! We\'ll send your free resource to your email.');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Contact form functionality - now uses FormSubmit
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Check if form was successfully submitted
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            alert('Thank you for your message! We\'ll respond within 2 business days.');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Lead capture triggers
    let hasShownExitIntent = false;
    let hasShownScrollDepth = false;
    let hasShownTimeBased = false;

    // Exit intent detection
    // document.addEventListener('mouseleave', function(e) {
    //     if (e.clientY <= 0 && !hasShownExitIntent) {
    //         hasShownExitIntent = true;
    //         setTimeout(() => openLeadModal('career-quiz'), 1000);
    //     }
    // });

    // // Scroll depth trigger
    // window.addEventListener('scroll', function() {
    //     const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    //     if (scrollPercent > 60 && !hasShownScrollDepth) {
    //         hasShownScrollDepth = true;
    //         setTimeout(() => openLeadModal('insider-guide'), 3000);
    //     }
    // });

    // Time-based trigger
    setTimeout(() => {
        if (!hasShownTimeBased) {
            hasShownTimeBased = true;
            openLeadModal('success-checklist');
        }
    }, 30000); // 30 seconds

    // Course interest trigger
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!hasShownScrollDepth) {
                setTimeout(() => openLeadModal('mini-class'), 5000);
            }
        });
    });
});
