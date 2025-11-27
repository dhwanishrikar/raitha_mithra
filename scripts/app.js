class RaithaMithraApp {
    constructor() {
        this.currentSection = null;
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
            if (typeof landing !== 'undefined') {
                landing.init();
            }
        }

        // Initialize additional features
        this.initEventListeners();

        console.log('🚜 RAITHA MITHRA - Agricultural Machinery Rental Portal');
        console.log('✅ Frontend successfully initialized');
        console.log('📧 Ready for Supabase backend integration');
    }

    initEventListeners() {
        // Global event listeners can be added here
        // Note: Removed global link handler to prevent interference with navigation
        // External links should be handled individually if needed

        // Add sample data if empty
        this.initializeSampleData();
    }

    // SPA Section Management
    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.spa-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Hide main app content
        document.getElementById('app').style.display = 'none';

        // Show the requested section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = sectionId;

            // Scroll to top when showing section
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    hideSection() {
        // Hide all sections
        const sections = document.querySelectorAll('.spa-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show main app content
        document.getElementById('app').style.display = 'block';
        this.currentSection = null;
    }

    initializeSampleData() {
        // Initialize sample users if none exist
        if (!localStorage.getItem('raithaMithraUsers') || JSON.parse(localStorage.getItem('raithaMithraUsers')).length === 0) {
            const sampleUsers = [
                {
                    id: 'user1',
                    name: 'Rajesh Kumar',
                    email: 'farmer@example.com',
                    phone: '9876543210',
                    password: 'password123',
                    type: 'farmer',
                    joinedDate: new Date().toISOString(),
                    isVerified: true,
                    address: 'Bangalore, Karnataka'
                },
                {
                    id: 'owner1',
                    name: 'Suresh Patel',
                    email: 'owner@example.com',
                    phone: '9876543211',
                    password: 'password123',
                    type: 'owner',
                    joinedDate: new Date().toISOString(),
                    isVerified: true,
                    address: 'Pune, Maharashtra'
                }
            ];
            localStorage.setItem('raithaMithraUsers', JSON.stringify(sampleUsers));
        }

        // Initialize sample rental history for ML recommendations
        if (!localStorage.getItem('userRentalHistory')) {
            const sampleHistory = [
                {
                    userId: 'user1',
                    machineId: '1',
                    interactionType: 'rent',
                    timestamp: new Date().toISOString()
                }
            ];
            localStorage.setItem('userRentalHistory', JSON.stringify(sampleHistory));
        }
    }
}

// Make classes globally available for HTML onclick events
window.Utils = Utils;
window.auth = auth;
window.machinery = machinery;
window.booking = booking;
window.payment = payment;
window.maps = maps;
window.recommendations = recommendations;
window.dashboard = dashboard;

// Initialize app instance globally
window.app = null;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RaithaMithraApp();
});
