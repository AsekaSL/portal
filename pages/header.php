<?php
$userRole = $_SESSION['role'] ?? null; // 'Admin', 'Professor', 'Student', or null
$isLoggedIn = isset($_SESSION['username']);
?>

<header class="main-header">
    <div class="header-container">
        <!-- Logo Section -->
        <div class="logo-section">
            <button class="logo-button" onclick="navigateHome()">
                <div class="logo-content">
                    <i class="fas fa-graduation-cap logo-icon"></i>
                    <span class="logo-text">EduPortal</span>
                </div>
            </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="nav-menu">
            <div class="nav-links">
                <a href="?page=home" style="text-decoration: none;"><button class="nav-item active" data-page="home">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </button>
                </a>

                <button class="nav-item" data-page="features">
                    <i class="fas fa-star"></i>
                    <span>Features</span>
                </button>
                <button class="nav-item" data-page="services">
                    <i class="fas fa-cogs"></i>
                    <span>Services</span>
                </button>
                <button class="nav-item" data-page="about">
                    <i class="fas fa-info-circle"></i>
                    <span>About</span>
                </button>
                <button class="nav-item" data-page="contact">
                    <i class="fas fa-envelope"></i>
                    <span>Contact</span>
                </button>
            </div>
            <div class="nav-indicator"></div>
        </nav>

        <!-- User Actions -->
        <div class="user-actions">
            <button class="notification-btn" title="Notifications">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">3</span>
            </button>
            <a href="?page=login" style="text-decoration: none;">
                <button class="login-button">
                    <i class="fas fa-sign-in-alt"></i>
                    Login
                </button>
            </a>

        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>