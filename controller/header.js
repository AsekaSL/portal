// Navigation functionality
class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.setupMobileMenu();
        this.setupUserMenu();
        this.updateNavIndicator();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const indicator = document.querySelector('.nav-indicator');

        navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Update indicator position
                this.updateNavIndicator();
                
                // Load page content
                const page = item.getAttribute('data-page');
                this.loadPage(page);
            });
        });
    }

    updateNavIndicator() {
        const activeItem = document.querySelector('.nav-item.active');
        const indicator = document.querySelector('.nav-indicator');
        
        if (activeItem && indicator) {
            const itemRect = activeItem.getBoundingClientRect();
            const navRect = activeItem.parentElement.getBoundingClientRect();
            
            const left = activeItem.offsetLeft;
            const width = activeItem.offsetWidth;
            
            indicator.style.left = `${left}px`;
            indicator.style.width = `${width}px`;
        }
    }

    loadPage(page) {
        const mainContent = document.querySelector('.main-content');
        
        // Show loading state
        mainContent.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: white; margin-bottom: 20px;"></i>
                <p style="color: white;">Loading ${page}...</p>
            </div>
        `;

        // Simulate loading with fetch
        fetch(`pages/${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${page}.html`);
                }
                return response.text();
            })
            .then(html => {
                mainContent.innerHTML = html;
                this.currentPage = page;
            })
            .catch(error => {
                mainContent.innerHTML = `
                    <div class="error-message" style="color: white; text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 20px;"></i>
                        <h2>Page Not Found</h2>
                        <p>${error.message}</p>
                        <p>Please check if the page exists or try again later.</p>
                        <button onclick="navigation.loadPage('home')" style="
                            background: white; 
                            color: #667eea; 
                            border: none; 
                            padding: 10px 20px; 
                            border-radius: 25px; 
                            margin-top: 20px; 
                            cursor: pointer;
                            font-weight: 600;
                        ">
                            <i class="fas fa-home"></i> Back to Home
                        </button>
                    </div>
                `;
                console.error('Navigation Error:', error);
            });
    }

    setupSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const searchOverlay = document.querySelector('.search-overlay');
        const searchClose = document.querySelector('.search-close');
        const searchInput = document.querySelector('.search-box input');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                setTimeout(() => searchInput.focus(), 300);
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
            });
        }

        // Close search on overlay click
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                    searchInput.value = '';
                }
            });
        }

        // Handle search input
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }

        // Handle suggestion clicks
        const suggestions = document.querySelectorAll('.suggestion-item');
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const searchTerm = suggestion.textContent.trim();
                this.performSearch(searchTerm);
            });
        });
    }

    performSearch(query) {
        if (!query.trim()) return;

        const searchOverlay = document.querySelector('.search-overlay');
        const mainContent = document.querySelector('.main-content');

        // Close search overlay
        searchOverlay.classList.remove('active');

        // Show search results
        mainContent.innerHTML = `
            <div class="search-results" style="color: white; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.8;"></i>
                <h2>Search Results for "${query}"</h2>
                <p style="margin: 20px 0; opacity: 0.9;">
                    This is where search results would appear.<br>
                    Integration with backend search API needed.
                </p>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-top: 30px;">
                    <p style="margin-bottom: 15px;"><strong>Suggested searches:</strong></p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 15px; cursor: pointer;" onclick="navigation.performSearch('student records')">Student Records</span>
                        <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 15px; cursor: pointer;" onclick="navigation.performSearch('courses')">Courses</span>
                        <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 15px; cursor: pointer;" onclick="navigation.performSearch('reports')">Reports</span>
                    </div>
                </div>
            </div>
        `;

        console.log('Searching for:', query);
    }

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                // Toggle mobile menu functionality
                console.log('Mobile menu toggled');
                // Add mobile menu implementation here
            });
        }
    }

    setupUserMenu() {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.textContent.trim().toLowerCase();
                
                switch(action) {
                    case 'profile':
                        this.showProfile();
                        break;
                    case 'settings':
                        this.showSettings();
                        break;
                    case 'help':
                        this.showHelp();
                        break;
                    case 'logout':
                        this.handleLogout();
                        break;
                    default:
                        console.log('Action:', action);
                }
            });
        });
    }

    showProfile() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div style="color: white; text-align: center; padding: 40px;">
                <i class="fas fa-user-circle" style="font-size: 4rem; margin-bottom: 20px;"></i>
                <h2>User Profile</h2>
                <p>Profile management interface would be implemented here.</p>
                <button onclick="window.open('professor-profile.html', '_blank')" style="
                    background: white; 
                    color: #667eea; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 25px; 
                    margin-top: 20px; 
                    cursor: pointer;
                    font-weight: 600;
                ">
                    <i class="fas fa-external-link-alt"></i> Open Profile Editor
                </button>
            </div>
        `;
    }

    showSettings() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div style="color: white; text-align: center; padding: 40px;">
                <i class="fas fa-cog" style="font-size: 4rem; margin-bottom: 20px;"></i>
                <h2>Settings</h2>
                <p>Application settings and preferences would be configured here.</p>
            </div>
        `;
    }

    showHelp() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div style="color: white; text-align: center; padding: 40px;">
                <i class="fas fa-question-circle" style="font-size: 4rem; margin-bottom: 20px;"></i>
                <h2>Help & Support</h2>
                <p>Documentation and support resources would be available here.</p>
                <div style="margin-top: 30px;">
                    <a href="mailto:support@eduportal.com" style="color: white; text-decoration: none; margin: 0 15px;">
                        <i class="fas fa-envelope"></i> Email Support
                    </a>
                    <a href="tel:+1234567890" style="color: white; text-decoration: none; margin: 0 15px;">
                        <i class="fas fa-phone"></i> Call Support
                    </a>
                </div>
            </div>
        `;
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Simulate logout process
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div style="color: white; text-align: center; padding: 40px;">
                    <i class="fas fa-sign-out-alt" style="font-size: 4rem; margin-bottom: 20px;"></i>
                    <h2>Logging out...</h2>
                    <p>You will be redirected to the login page.</p>
                </div>
            `;
            
            // Simulate redirect after delay
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        }
    }
}

// Utility functions
function navigateHome() {
    navigation.loadPage('home');
    
    // Reset nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('[data-page="home"]').classList.add('active');
    navigation.updateNavIndicator();
}

function showLogin() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div style="color: white; text-align: center; padding: 40px;">
            <i class="fas fa-sign-in-alt" style="font-size: 4rem; margin-bottom: 20px;"></i>
            <h2>Login Portal</h2>
            <p>Redirecting to login interface...</p>
            <div style="margin-top: 30px;">
                <button onclick="window.open('professor-profile.html', '_blank')" style="
                    background: white; 
                    color: #667eea; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 25px; 
                    margin: 10px; 
                    cursor: pointer;
                    font-weight: 600;
                ">
                    <i class="fas fa-chalkboard-teacher"></i> Professor Portal
                </button>
                <button onclick="alert('Student portal coming soon!')" style="
                    background: rgba(255,255,255,0.2); 
                    color: white; 
                    border: 2px solid white; 
                    padding: 12px 24px; 
                    border-radius: 25px; 
                    margin: 10px; 
                    cursor: pointer;
                    font-weight: 600;
                ">
                    <i class="fas fa-user-graduate"></i> Student Portal
                </button>
            </div>
        </div>
    `;
}

// Notification handling
function handleNotifications() {
    const badge = document.querySelector('.notification-badge');
    const currentCount = parseInt(badge.textContent);
    
    if (currentCount > 0) {
        badge.textContent = currentCount - 1;
        if (currentCount - 1 === 0) {
            badge.style.display = 'none';
        }
    }
    
    // Show notification panel
    alert('Notification system would be implemented here!');
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new NavigationManager();
    
    // Add notification click handler
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', handleNotifications);
    }
    
    // Handle window resize for nav indicator
    window.addEventListener('resize', () => {
        navigation.updateNavIndicator();
    });
    
    console.log('EduPortal Header System Initialized');
});