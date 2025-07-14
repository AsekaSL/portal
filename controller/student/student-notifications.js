const API_BASE_URL = 'http://localhost:3000/api'; // Update this to your backend URL
const STUDENT_ID = localStorage.getItem('studentId') || '12345'; //

let notifications = [];
let filteredNotifications = [];
let currentFilter = 'all';
let selectedNotification = null;

document.addEventListener('DOMContentLoaded', function() {
    loadNotifications();
    
   
    setInterval(loadNotifications, 30000);
});

// Load notifications from backend
async function loadNotifications() {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}/notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        notifications = data.notifications || [];
        
        updateNotificationStats();
        filterNotifications(currentFilter);
        updateNotificationBadge();
        
    } catch (error) {
        console.error('Error loading notifications:', error);
        showError('Failed to load notifications. Please try again later.');
        
        // Use mock data for development
        loadMockNotifications();
    } finally {
        showLoading(false);
    }
}

// Load mock notifications for development
function loadMockNotifications() {
    console.log('Loading mock notifications for development...');
    notifications = [
        {
            id: 1,
            subject: 'Low Attendance Warning - CS101',
            message: 'Your attendance in Introduction to Computer Science has dropped below 75%. Current attendance: 68.6%. Please ensure regular attendance to meet the minimum requirement.',
            type: 'attendance',
            isRead: false,
            isImportant: true,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            courseCode: 'CS101'
        },
        {
            id: 2,
            subject: 'Assignment Deadline Reminder',
            message: 'The assignment for Calculus II is due tomorrow at 11:59 PM. Please submit your work before the deadline.',
            type: 'academic',
            isRead: false,
            isImportant: false,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            courseCode: 'MATH201'
        },
        {
            id: 3,
            subject: 'System Maintenance Notice',
            message: 'Scheduled maintenance will be performed on the student portal from 2:00 AM to 4:00 AM tomorrow. The system will be temporarily unavailable during this time.',
            type: 'system',
            isRead: true,
            isImportant: false,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            courseCode: null
        },
        {
            id: 4,
            subject: 'Fee Payment Reminder',
            message: 'Your semester fee payment is due by the end of this week. Please complete the payment to avoid any late fees.',
            type: 'important',
            isRead: false,
            isImportant: true,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            courseCode: null
        },
        {
            id: 5,
            subject: 'Grade Posted - Technical Writing',
            message: 'Your grade for the recent assignment in Technical Writing has been posted. You can view it in the grades section.',
            type: 'academic',
            isRead: true,
            isImportant: false,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            courseCode: 'ENG102'
        },
        {
            id: 6,
            subject: 'Attendance Improvement - Quantum Physics',
            message: 'Great improvement in your attendance for Quantum Physics! Your attendance has increased to 78%. Keep up the good work.',
            type: 'attendance',
            isRead: false,
            isImportant: false,
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            courseCode: 'PHY301'
        }
    ];
    
    updateNotificationStats();
    filterNotifications(currentFilter);
    updateNotificationBadge();
}

// Filter notifications
function filterNotifications(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Filter notifications
    switch (filter) {
        case 'unread':
            filteredNotifications = notifications.filter(n => !n.isRead);
            break;
        case 'important':
            filteredNotifications = notifications.filter(n => n.isImportant);
            break;
        case 'attendance':
            filteredNotifications = notifications.filter(n => n.type === 'attendance');
            break;
        case 'system':
            filteredNotifications = notifications.filter(n => n.type === 'system');
            break;
        default:
            filteredNotifications = [...notifications];
    }
    
    renderNotifications();
}

// Render notifications
function renderNotifications() {
    const container = document.getElementById('notificationsList');
    
    if (filteredNotifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>No notifications found</h3>
                <p>You don't have any notifications matching the current filter.</p>
            </div>
        `;
        return;
    }
    
    // Sort notifications by timestamp (newest first)
    filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    container.innerHTML = filteredNotifications.map(notification => `
        <div class="notification-item ${notification.isRead ? '' : 'unread'}" onclick="openNotificationModal(${notification.id})">
            <div class="notification-icon ${notification.type}">
                ${getNotificationIcon(notification.type)}
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <div class="notification-subject">${notification.subject}</div>
                    <div class="notification-type type-${notification.type}">${notification.type}</div>
                </div>
                <div class="notification-message">
                    ${truncateMessage(notification.message, 120)}
                </div>
                <div class="notification-footer">
                    <div class="notification-timestamp">${formatTimestamp(notification.timestamp)}</div>
                    <div class="notification-actions" onclick="event.stopPropagation()">
                        ${!notification.isRead ? `<button class="action-btn action-read" onclick="markAsRead(${notification.id})">Mark Read</button>` : ''}
                        <button class="action-btn action-dismiss" onclick="dismissNotification(${notification.id})">Dismiss</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Open notification modal
function openNotificationModal(notificationId) {
    selectedNotification = notifications.find(n => n.id === notificationId);
    if (!selectedNotification) return;
    
    document.getElementById('modalSubject').textContent = selectedNotification.subject;
    document.getElementById('modalTimestamp').textContent = formatTimestamp(selectedNotification.timestamp);
    document.getElementById('modalType').innerHTML = `<div class="notification-type type-${selectedNotification.type}">${selectedNotification.type}</div>`;
    document.getElementById('modalMessage').textContent = selectedNotification.message;
    
    // Show/hide mark as read button
    const markReadBtn = document.getElementById('modalMarkRead');
    if (selectedNotification.isRead) {
        markReadBtn.style.display = 'none';
    } else {
        markReadBtn.style.display = 'inline-flex';
    }
    
    document.getElementById('notificationModal').style.display = 'block';
}

// Close notification modal
function closeModal() {
    document.getElementById('notificationModal').style.display = 'none';
    selectedNotification = null;
}

// Mark notification as read
async function markAsRead(notificationId) {
    try {
        const response = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local data
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
        }
        
        updateNotificationStats();
        filterNotifications(currentFilter);
        updateNotificationBadge();
        
    } catch (error) {
        console.error('Error marking notification as read:', error);
        // For development, update locally
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            updateNotificationStats();
            filterNotifications(currentFilter);
            updateNotificationBadge();
        }
    }
}

// Mark notification as read from modal
function markNotificationAsRead() {
    if (selectedNotification) {
        markAsRead(selectedNotification.id);
        closeModal();
    }
}

// Dismiss notification
async function dismissNotification(notificationId) {
    if (!confirm('Are you sure you want to dismiss this notification?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local data
        notifications = notifications.filter(n => n.id !== notificationId);
        
        updateNotificationStats();
        filterNotifications(currentFilter);
        updateNotificationBadge();
        
        // Close modal if this notification is currently selected
        if (selectedNotification && selectedNotification.id === notificationId) {
            closeModal();
        }
        
    } catch (error) {
        console.error('Error dismissing notification:', error);
        // For development, remove locally
        notifications = notifications.filter(n => n.id !== notificationId);
        updateNotificationStats();
        filterNotifications(currentFilter);
        updateNotificationBadge();
        
        if (selectedNotification && selectedNotification.id === notificationId) {
            closeModal();
        }
    }
}

// Mark all notifications as read
async function markAllAsRead() {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    if (unreadNotifications.length === 0) {
        alert('All notifications are already marked as read.');
        return;
    }
    
    if (!confirm(`Mark all ${unreadNotifications.length} unread notifications as read?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}/notifications/mark-all-read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local data
        notifications.forEach(n => n.isRead = true);
        
        updateNotificationStats();
        filterNotifications(currentFilter);
        updateNotificationBadge();
        
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        // For development, update locally
        notifications.forEach(n => n.isRead = true);
        updateNotificationStats();
        filterNotifications(currentFilter);
        updateNotificationBadge();
    }
}

// Update notification statistics
function updateNotificationStats() {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const totalCount = notifications.length;
    const alertCount = notifications.filter(n => n.isImportant && !n.isRead).length;
    const systemCount = notifications.filter(n => n.type === 'system').length;
    
    document.getElementById('unreadCount').textContent = unreadCount;
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('alertCount').textContent = alertCount;
    document.getElementById('systemCount').textContent = systemCount;
}

// Update notification badge
function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const badge = document.getElementById('notificationBadge');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

// Helper functions
function getNotificationIcon(type) {
    switch (type) {
        case 'attendance':
            return '<i class="fas fa-user-clock"></i>';
        case 'system':
            return '<i class="fas fa-cog"></i>';
        case 'academic':
            return '<i class="fas fa-graduation-cap"></i>';
        case 'important':
            return '<i class="fas fa-star"></i>';
        default:
            return '<i class="fas fa-bell"></i>';
    }
}

function truncateMessage(message, maxLength) {
    if (message.length <= maxLength) {
        return message;
    }
    return message.substring(0, maxLength) + '...';
}

function formatTimestamp(timestamp) {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        if (days < 7) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return notificationDate.toLocaleDateString();
        }
    }
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
}

// Navigation functions
function goBack() {
    window.history.back();
}

function refreshNotifications() {
    loadNotifications();
}

function toggleNotifications() {
    // This function can be used to toggle a notification dropdown
    // For now, it just refreshes the notifications
    loadNotifications();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('notificationModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Export functions for testing
window.notificationSystem = {
    loadNotifications,
    markAllAsRead,
    refreshNotifications
};