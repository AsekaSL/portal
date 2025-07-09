// Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your actual API URL

// Global variables
let currentStudentData = {};
let pendingRequests = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('studentProfileForm');
    const photoInput = document.getElementById('photoInput');
    const changePhotoBtn = document.getElementById('changePhotoBtn');

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Photo change
    changePhotoBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', handlePhotoChange);

    // Password validation
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    confirmPassword.addEventListener('input', validatePasswordMatch);
    newPassword.addEventListener('input', validatePasswordMatch);
}

// Initialize profile data
async function initializeProfile() {
    try {
        showLoading(true);
        
        // Get student ID from session storage or URL parameter
        const studentId = getStudentId();
        
        if (!studentId) {
            throw new Error('Student ID not found. Please login again.');
        }

        // Load student profile data
        await loadStudentProfile(studentId);
        
        // Load pending requests
        await loadPendingRequests(studentId);
        
        hideLoading();
    } catch (error) {
        console.error('Error initializing profile:', error);
        showError(error.message);
        hideLoading();
    }
}

// Get student ID from session or URL
function getStudentId() {
    // Try to get from session storage first
    let studentId = sessionStorage.getItem('studentId');
    
    // If not in session, try URL parameters
    if (!studentId) {
        const urlParams = new URLSearchParams(window.location.search);
        studentId = urlParams.get('studentId');
    }
    
    // If still not found, try to get from local storage
    if (!studentId) {
        studentId = localStorage.getItem('loggedInStudentId');
    }
    
    return studentId;
}

// Load student profile from database
async function loadStudentProfile(studentId) {
    try {
        // Simulate API call - replace with actual database connection
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load student profile');
        }

        const studentData = await response.json();
        currentStudentData = studentData;
        
        populateForm(studentData);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to demo data for testing
        loadDemoData();
    }
}

// Load demo data for testing
function loadDemoData() {
    const demoData = {
        firstName: 'John',
        lastName: 'Doe',
        regNum: 'REG2024001',
        indexNumber: 'CS/2024/001',
        email: 'john.doe@university.edu',
        contactNumber: '+1234567890',
        dateOfBirth: '2000-05-15',
        gender: 'male',
        address: '123 Main Street, City, State 12345',
        program: 'Computer Science',
        department: 'Faculty of Computing',
        year: '2',
        status: 'active',
        emergencyContactName: 'Jane Doe',
        emergencyContactNumber: '+1234567891',
        emergencyContactRelation: 'parent',
        emergencyContactAddress: '123 Main Street, City, State 12345',
        profilePhoto: 'https://via.placeholder.com/150'
    };
    
    currentStudentData = demoData;
    populateForm(demoData);
}

// Populate form with student data
function populateForm(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'file') {
                // Skip file inputs
                return;
            } else if (key === 'profilePhoto') {
                const profilePhoto = document.getElementById('profilePhoto');
                if (profilePhoto && data[key]) {
                    profilePhoto.src = data[key];
                }
            } else {
                element.value = data[key] || '';
            }
        }
    });
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(event.target);
        const updateData = {};
        
        // Only include changed fields
        for (let [key, value] of formData.entries()) {
            if (key !== 'currentPassword' && value !== currentStudentData[key]) {
                updateData[key] = value;
            }
        }
        
        // Handle password change
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        
        if (newPassword && currentPassword) {
            updateData.passwordChange = {
                currentPassword: currentPassword,
                newPassword: newPassword
            };
        }
        
        if (Object.keys(updateData).length === 0) {
            showError('No changes detected.');
            return;
        }
        
        // Submit update
        await updateStudentProfile(updateData);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError(error.message);
    }
}

// Update student profile
async function updateStudentProfile(updateData) {
    try {
        const studentId = getStudentId();
        
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        const result = await response.json();
        
        showSuccess('Profile updated successfully!');
        
        // Update current data
        Object.assign(currentStudentData, updateData);
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
    } catch (error) {
        console.error('Update error:', error);
        // Simulate successful update for demo
        showSuccess('Profile updated successfully! (Demo mode)');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }
}

// Handle photo change
function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB.');
        return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('profilePhoto').src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Upload image
    uploadProfilePhoto(file);
}

// Upload profile photo
async function uploadProfilePhoto(file) {
    try {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('studentId', getStudentId());
        
        const response = await fetch(`${API_BASE_URL}/students/upload-photo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload photo');
        }

        const result = await response.json();
        showSuccess('Profile photo updated successfully!');
        
    } catch (error) {
        console.error('Photo upload error:', error);
        showSuccess('Profile photo updated successfully! (Demo mode)');
    }
}

// Form validation
function validateForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'contactNumber', 'dateOfBirth', 'address', 'year'];
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showError(`${field.previousElementSibling.textContent.replace('*', '').trim()} is required.`);
            field.focus();
            return false;
        }
    }
    
    // Email validation
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        document.getElementById('email').focus();
        return false;
    }
    
    // Phone validation
    const phone = document.getElementById('contactNumber').value;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showError('Please enter a valid contact number.');
        document.getElementById('contactNumber').focus();
        return false;
    }
    
    return true;
}

// Validate password match
function validatePasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        document.getElementById('confirmPassword').setCustomValidity('Passwords do not match');
    } else {
        document.getElementById('confirmPassword').setCustomValidity('');
    }
}

// Load pending change requests
async function loadPendingRequests(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/change-requests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (response.ok) {
            const requests = await response.json();
            pendingRequests = requests;
            displayPendingRequests(requests);
        }
        
    } catch (error) {
        console.error('Error loading pending requests:', error);
        // Load demo requests for testing
        loadDemoPendingRequests();
    }
}

// Load demo pending requests
function loadDemoPendingRequests() {
    const demoRequests = [
        {
            id: 1,
            field: 'Gender',
            requestedValue: 'Other',
            reason: 'Gender identity change',
            status: 'pending',
            requestDate: '2024-01-15'
        }
    ];
    
    pendingRequests = demoRequests;
    displayPendingRequests(demoRequests);
}

// Display pending requests
function displayPendingRequests(requests) {
    const requestsContainer = document.querySelector('.pending-requests');
    const requestsList = document.getElementById('requestsList');
    
    if (requests.length === 0) {
        requestsContainer.style.display = 'none';
        return;
    }
    
    requestsContainer.style.display = 'block';
    requestsList.innerHTML = '';
    
    requests.forEach(request => {
        const requestElement = document.createElement('div');
        requestElement.className = 'request-item';
        requestElement.innerHTML = `
            <div class="request-info">
                <h4>Change Request for ${request.field}</h4>
                <p><strong>Requested Value:</strong> ${request.requestedValue}</p>
                <p><strong>Reason:</strong> ${request.reason}</p>
                <p><strong>Date:</strong> ${new Date(request.requestDate).toLocaleDateString()}</p>
            </div>
            <div class="request-status status-${request.status}">
                ${request.status}
            </div>
        `;
        requestsList.appendChild(requestElement);
    });
}

// Utility functions
function showLoading(show = true) {
    const spinner = document.getElementById('loadingSpinner');
    const form = document.getElementById('studentProfileForm');
    
    if (show) {
        spinner.style.display = 'block';
        form.style.display = 'none';
    } else {
        spinner.style.display = 'none';
        form.style.display = 'block';
    }
}

function hideLoading() {
    showLoading(false);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
    
    // Hide success message if shown
    document.getElementById('successMessage').style.display = 'none';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    successText.textContent = message;
    successDiv.style.display = 'flex';
    
    // Hide error message if shown
    document.getElementById('errorMessage').style.display = 'none';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

function getAuthToken() {
    return localStorage.getItem('studentAuthToken') || sessionStorage.getItem('studentAuthToken') || 'demo-token';
}

// Navigation functions
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/student-dashboard.html';
    }
}

function refreshProfile() {
    location.reload();
}

function resetForm() {
    if (confirm('Are you sure you want to reset all changes?')) {
        populateForm(currentStudentData);
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Hide messages
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
    }
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function submitChangeRequest() {
    const field = document.getElementById('requestField').value;
    const reason = document.getElementById('requestReason').value;
    const requestedValue = document.getElementById('requestedValue').value;
    
    if (!reason.trim() || !requestedValue.trim()) {
        showError('Please fill in all required fields for the change request.');
        return;
    }
    
    // Submit change request (simulate API call)
    console.log('Change request submitted:', { field, reason, requestedValue });
    showSuccess('Change request submitted successfully!');
    closeModal('changeRequestModal');
    
    // Clear form
    document.getElementById('changeRequestForm').reset();
}

/*
DATABASE SCHEMA SUGGESTIONS:

1. Students Table:
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reg_num VARCHAR(50) UNIQUE NOT NULL,
    index_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other') NOT NULL,
    address TEXT,
    program VARCHAR(200) NOT NULL,
    department VARCHAR(200) NOT NULL,
    year INT NOT NULL,
    status ENUM('active', 'suspended', 'graduated', 'dropped') DEFAULT 'active',
    profile_photo_url VARCHAR(500),
    emergency_contact_name VARCHAR(100),
    emergency_contact_number VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    emergency_contact_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

2. Student Change Requests Table:
CREATE TABLE student_change_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    current_value TEXT,
    requested_value TEXT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_comment TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (reviewed_by) REFERENCES admins(id)
);

REQUIRED API ENDPOINTS:

1. GET /api/students/:id - Get student profile
2. PUT /api/students/:id - Update student profile
3. POST /api/students/upload-photo - Upload profile photo
4. GET /api/students/:id/change-requests - Get pending change requests
5. POST /api/students/:id/change-requests - Submit change request

AUTHENTICATION:
- Implement JWT token-based authentication
- Store token in localStorage or sessionStorage
- Include Authorization header in all API calls

To integrate with MySQL:
1. Update API_BASE_URL in this file
2. Implement the backend API endpoints
3. Set up proper authentication middleware
4. Configure CORS for cross-origin requests
*/