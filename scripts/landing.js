class LandingPageManager {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is authenticated
        const currentUser = Utils.getCurrentUser();

        if (currentUser) {
            // User is logged in, show dashboard
            if (typeof dashboard !== 'undefined') {
                dashboard.show();
            }
        } else {
            // User not logged in, show landing page
            this.showLandingPage();
        }

        this.initScrollEffects();
        this.initIntersectionObserver();
    }

    showLandingPage() {
        document.getElementById('app').innerHTML = `
            <div class="landing-page">
                <!-- Header -->
                <header class="landing-header" id="landing-header">
                    <div class="header-container">
                        <a href="#" class="logo" onclick="landing.scrollToTop()">
                            <i class="fas fa-tractor logo-icon"></i>
                            <div class="logo-text">RAITHA <span>MITHRA</span></div>
                        </a>

                        <nav>
                            <ul class="nav-menu">
                                <li><a href="#features" class="nav-link" onclick="landing.scrollToSection('features')">Features</a></li>
                                <li><a href="#how-it-works" class="nav-link" onclick="landing.scrollToSection('how-it-works')">How It Works</a></li>
                                <li><a href="#pricing" class="nav-link" onclick="landing.scrollToSection('pricing')">Pricing</a></li>
                                <li><a href="#contact" class="nav-link" onclick="landing.scrollToSection('contact')">Contact</a></li>
                            </ul>
                        </nav>

                        <div class="cta-buttons">
                            <button class="btn btn-outline" onclick="auth.showLogin()">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                            <button class="btn btn-primary" onclick="auth.showSignup()">
                                <i class="fas fa-user-plus"></i> Get Started
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="hero-container">
                        <div class="hero-content">
                            <h1 class="hero-title">
                                Revolutionizing <span>Agriculture</span><br>
                                Through Technology
                            </h1>
                            <p class="hero-subtitle">
                                Connect farmers with machinery owners across India. Rent tractors, harvesters,
                                and farming equipment instantly with our AI-powered platform.
                            </p>

                            <div class="hero-stats">
                                <div class="stat-item">
                                    <span class="stat-label">Happy Farmers</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">100+</span>
                                    <span class="stat-label">Machinery Available</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">10+</span>
                                    <span class="stat-label">Cities Covered</span>
                                </div>
                            </div>

                            <div class="cta-buttons">
                                <button class="btn btn-primary btn-large" onclick="auth.showSignup()">
                                    <i class="fas fa-rocket"></i> Start Renting Today
                                </button>
                                <button class="btn btn-outline btn-large" onclick="landing.scrollToSection('features')">
                                    <i class="fas fa-play"></i> Learn More
                                </button>
                            </div>
                        </div>

                        <div class="hero-visual">
                            <div class="hero-image">
                                <i class="fas fa-tractor hero-tractor"></i>
                                <div class="hero-features">
                                    <div class="hero-feature">
                                        <i class="fas fa-search"></i>
                                        <h4>Smart Search</h4>
                                        <p>Find equipment near you</p>
                                    </div>
                                    <div class="hero-feature">
                                        <i class="fas fa-calendar-check"></i>
                                        <h4>Instant Booking</h4>
                                        <p>Book in minutes</p>
                                    </div>
                                    <div class="hero-feature">
                                        <i class="fas fa-shield-alt"></i>
                                        <h4>Verified Owners</h4>
                                        <p>Trusted machinery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Features Section -->
                <section id="features" class="features-section">
                    <div class="features-container">
                        <div class="section-header">
                            <h2 class="section-title">Why Choose Raitha Mithra?</h2>
                            <p class="section-subtitle">
                                Experience the future of agricultural machinery rental with our innovative platform
                                designed specifically for Indian farmers.
                            </p>
                        </div>

                        <div class="features-grid">
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-search-location"></i>
                                </div>
                                <h3 class="feature-title">Location-Based Search</h3>
                                <p class="feature-description">
                                    Find machinery within your area using our advanced GPS technology.
                                    No more traveling long distances to rent equipment.
                                </p>
                            </div>

                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-brain"></i>
                                </div>
                                <h3 class="feature-title">AI Recommendations</h3>
                                <p class="feature-description">
                                    Our machine learning algorithms suggest the best equipment based on
                                    your farming needs, crop type, and field conditions.
                                </p>
                            </div>

                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <h3 class="feature-title">Mobile First Design</h3>
                                <p class="feature-description">
                                    Access all features on your smartphone. Book equipment, track rentals,
                                    and manage payments from anywhere.
                                </p>
                            </div>

                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-handshake"></i>
                                </div>
                                <h3 class="feature-title">Verified Partners</h3>
                                <p class="feature-description">
                                    All machinery owners are verified with proper documentation.
                                    Rent with confidence and peace of mind.
                                </p>
                            </div>

                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <h3 class="feature-title">24/7 Support</h3>
                                <p class="feature-description">
                                    Round-the-clock customer support in multiple languages.
                                    Get help whenever you need it.
                                </p>
                            </div>

                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-rupee-sign"></i>
                                </div>
                                <h3 class="feature-title">Transparent Pricing</h3>
                                <p class="feature-description">
                                    No hidden charges. Clear pricing with delivery, fuel, and
                                    operator costs included in the rental amount.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="cta-section">
                    <div class="cta-container">
                        <h2 class="cta-title">Ready to Transform Your Farming?</h2>
                        <p class="cta-subtitle">
                            Join thousands of farmers who have already discovered the convenience of renting
                            agricultural machinery through our platform.
                        </p>
                        <div class="cta-buttons">
                            <button class="btn btn-primary btn-large" onclick="auth.showSignup()">
                                <i class="fas fa-user-plus"></i> Join as Farmer
                            </button>
                            <button class="btn btn-outline btn-large" onclick="auth.showSignup()">
                                <i class="fas fa-tractor"></i> List Your Machinery
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="landing-footer">
                    <div class="footer-container">
                        <div class="footer-brand">
                            <div class="footer-logo">
                                <i class="fas fa-tractor logo-icon"></i>
                                <div class="logo-text">RAITHA <span>MITHRA</span></div>
                            </div>
                            <p class="footer-description">
                                Empowering Indian agriculture through technology. Connecting farmers with
                                machinery owners for a sustainable farming future.
                            </p>
                        </div>

                        <div class="footer-links">
                            <h4>Platform</h4>
                            <ul>
                                <li><a href="#" onclick="auth.showSignup()">For Farmers</a></li>
                                <li><a href="#" onclick="auth.showSignup()">For Owners</a></li>
                                <li><a href="#features" onclick="landing.scrollToSection('features')">Features</a></li>
                                <li><a href="#pricing" onclick="landing.scrollToSection('pricing')">Pricing</a></li>
                            </ul>
                        </div>

                        <div class="footer-links">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#contact" onclick="landing.scrollToSection('contact')">Contact Us</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Safety Guidelines</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div class="footer-links">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <p>&copy; Mini Project Team 1 - 5C : Ashmith , Quadir ,Bhoomika , Dhwani</p>
                    </div>
                </footer>
            </div>
        `;
    }

    initScrollEffects() {
        const header = document.getElementById('landing-header');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-scale');
                }
            });
        }, observerOptions);

        // Observe feature cards
        setTimeout(() => {
            document.querySelectorAll('.feature-card').forEach(card => {
                observer.observe(card);
            });
        }, 100);
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize landing page manager
const landing = new LandingPageManager();

