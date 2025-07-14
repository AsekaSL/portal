const API_BASE_URL = 'http://localhost:3000/api'; 
const PROFESSOR_ID = localStorage.getItem('professorId') || 'p001';

let notifications = [];
let filteredNotifications = [];
let currentFilter = 'all';
let selectedNotification = null;

document.addEventListener('DOMContentLoaded', function () {
  loadNotifications();
  setInterval(loadNotifications, 30000);
});

// Load notifications (mock for now)
async function loadNotifications() {
  try {
    showLoading(true);
    hideError();

    // Uncomment for actual backend call
    /*
    const res = await fetch(`${API_BASE_URL}/professor/${PROFESSOR_ID}/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) throw new Error('Failed to load notifications');

    const data = await res.json();
    notifications = data.notifications || [];
    */

    notifications = [
      {
        id: 101,
        subject: 'New Assignment Submissions - SE201',
        message: '10 students submitted Assignment 02 for SE201. Review them soon.',
        type: 'important',
        isRead: false,
        isImportant: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 102,
        subject: 'System Maintenance',
        message: 'Portal will be under maintenance tonight 10PM - 12AM.',
        type: 'system',
        isRead: false,
        isImportant: false,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        id: 103,
        subject: 'Meeting with Dean',
        message: 'Don’t forget the scheduled department meeting at 9:00 AM.',
        type: 'important',
        isRead: true,
        isImportant: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: 104,
        subject: 'Feedback Reminder',
        message: 'Course feedback survey needs to be completed by Friday.',
        type: 'general',
        isRead: false,
        isImportant: false,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      }
    ];

    updateNotificationStats();
    filterNotifications(currentFilter);
  } catch (error) {
    console.error('Load failed:', error);
    showError('Unable to load notifications. Try again later.');
  } finally {
    showLoading(false);
  }
}

function filterNotifications(filter) {
  currentFilter = filter;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

  switch (filter) {
    case 'unread':
      filteredNotifications = notifications.filter(n => !n.isRead);
      break;
    case 'important':
      filteredNotifications = notifications.filter(n => n.isImportant);
      break;
    case 'system':
      filteredNotifications = notifications.filter(n => n.type === 'system');
      break;
    default:
      filteredNotifications = [...notifications];
  }

  renderNotifications();
}

function renderNotifications() {
  const container = document.getElementById('notificationsList');
  if (filteredNotifications.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <h3>No notifications</h3>
        <p>No messages under this category.</p>
      </div>`;
    return;
  }

  filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  container.innerHTML = filteredNotifications.map(n => `
    <div class="notification-item ${n.isRead ? '' : 'unread'}" onclick="openNotificationModal(${n.id})">
      <div class="notification-icon ${n.type}">
        ${getNotificationIcon(n.type)}
      </div>
      <div class="notification-content">
        <div class="notification-header">
          <div class="notification-subject">${n.subject}</div>
          <div class="notification-type type-${n.type}">${n.type}</div>
        </div>
        <div class="notification-message">${truncateMessage(n.message, 120)}</div>
        <div class="notification-footer">
          <div class="notification-timestamp">${formatTimestamp(n.timestamp)}</div>
          <div class="notification-actions" onclick="event.stopPropagation()">
            ${!n.isRead ? `<button class="action-btn action-read" onclick="markAsRead(${n.id})">Mark Read</button>` : ''}
            <button class="action-btn action-dismiss" onclick="dismissNotification(${n.id})">Dismiss</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function openNotificationModal(id) {
  selectedNotification = notifications.find(n => n.id === id);
  if (!selectedNotification) return;

  document.getElementById('modalSubject').textContent = selectedNotification.subject;
  document.getElementById('modalTimestamp').textContent = formatTimestamp(selectedNotification.timestamp);
  document.getElementById('modalType').innerHTML = `<div class="notification-type type-${selectedNotification.type}">${selectedNotification.type}</div>`;
  document.getElementById('modalMessage').textContent = selectedNotification.message;

  const markReadBtn = document.getElementById('modalMarkRead');
  markReadBtn.style.display = selectedNotification.isRead ? 'none' : 'inline-flex';

  document.getElementById('notificationModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('notificationModal').style.display = 'none';
  selectedNotification = null;
}

function markAsRead(id) {
  const n = notifications.find(n => n.id === id);
  if (n) n.isRead = true;
  updateNotificationStats();
  filterNotifications(currentFilter);
}

function dismissNotification(id) {
  if (!confirm('Dismiss this notification?')) return;
  notifications = notifications.filter(n => n.id !== id);
  updateNotificationStats();
  filterNotifications(currentFilter);
  closeModal();
}

function markNotificationAsRead() {
  if (selectedNotification) {
    markAsRead(selectedNotification.id);
    closeModal();
  }
}

function markAllAsRead() {
  notifications.forEach(n => n.isRead = true);
  updateNotificationStats();
  filterNotifications(currentFilter);
}

function refreshNotifications() {
  loadNotifications();
}

function goBack() {
  window.history.back();
}

function updateNotificationStats() {
  document.getElementById('unreadCount').textContent = notifications.filter(n => !n.isRead).length;
  document.getElementById('totalCount').textContent = notifications.length;
  document.getElementById('alertCount').textContent = notifications.filter(n => n.isImportant && !n.isRead).length;
  document.getElementById('systemCount').textContent = notifications.filter(n => n.type === 'system').length;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60)); // in minutes
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function truncateMessage(msg, len) {
  return msg.length <= len ? msg : msg.slice(0, len) + '...';
}

function getNotificationIcon(type) {
  switch (type) {
    case 'system': return '<i class="fas fa-cog"></i>';
    case 'important': return '<i class="fas fa-star"></i>';
    default: return '<i class="fas fa-bell"></i>';
  }
}

function showLoading(show) {
  document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
}

function showError(msg) {
  document.getElementById('errorText').textContent = msg;
  document.getElementById('errorMessage').style.display = 'flex';
}

function hideError() {
  document.getElementById('errorMessage').style.display = 'none';
}

window.onclick = function (event) {
  const modal = document.getElementById('notificationModal');
  if (event.target === modal) closeModal();
};
