
// Professor Profile Management System
class ProfessorProfileManager {
    constructor() {
        this.isEditMode = false;
        this.currentProfessor = null;
        this.pendingRequests = [];
        this.API_BASE_URL = 'http://localhost:3000/api'; // Change this to your backend URL
        
        this.init();
    }

    async init() {
        await this.loadProfessorProfile();
        this.bindEvents();
        await this.loadPendingRequests();
    }

    // Event Bindings
    bindEvents() {
        // Edit Mode Toggle
        document.getElementById('editModeBtn').addEventListener('click', () => {
            this.toggleEditMode();
        });

        // Cancel Button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Form Submit
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Photo Change
        document.getElementById('changePhotoBtn').addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });

        document.getElementById('photoInput').addEventListener('change', (e) => {
            this.handlePhotoChange(e);
        });

        // Request Change Buttons
        document.querySelectorAll('.request-change-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fieldName = e.target.closest('.request-change-btn').dataset.field;
                this.openChangeRequestModal(fieldName);
            });
        });

        // Modal Events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelRequest').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('submitRequest').addEventListener('click', () => {
            this.submitChangeRequest();
        });

        // Close modal on outside click
        document.getElementById('changeRequestModal').addEventListener('click', (e) => {
            if (e.target.id === 'changeRequestModal') {
                this.closeModal();
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    // Load Professor Profile
    async loadProfessorProfile() {
        try {
            this.showLoading(true);
            
            // Simulated API call - replace with actual API
            const response = await this.simulateApiCall('/professor/profile', 'GET');
            
            if (response.success) {
                this.currentProfessor = response.data;
                this.populateForm(this.currentProfessor);
                this.showForm(true);
            } else {
                this.showError('Failed to load profile: ' + response.message);
            }
        } catch (error) {
            this.showError('Error loading profile: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Populate Form with Data
    populateForm(data) {
        // Basic Information
        document.getElementById('professorId').value = data.professorId || '';
        document.getElementById('professorName').value = data.professorName || '';
        document.getElementById('nic').value = data.nic || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phoneNumber').value = data.phoneNumber || '';
        document.getElementById('department').value = data.department || '';
        document.getElementById('designation').value = data.designation || '';
        document.getElementById('dateOfJoin').value = data.dateOfJoin || '';
        document.getElementById('status').value = data.status || '';

        // Academic Information
        document.getElementById('degree').value = data.degree || '';
        document.getElementById('specialization').value = data.specialization || '';
        document.getElementById('publications').value = data.publications || '';
        document.getElementById('coursesTaught').value = data.coursesTaught || '';

        // Address
        document.getElementById('address').value = data.address || '';

        // Emergency Contact
        document.getElementById('emergencyName').value = data.emergencyContact?.name || '';
        document.getElementById('emergencyPhone').value = data.emergencyContact?.phone || '';
        document.getElementById('emergencyRelation').value = data.emergencyContact?.relation || '';

        // Photo
        if (data.photo) {
            document.getElementById('profilePhoto').src = data.photo;
        }
    }

    // Toggle Edit Mode
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        
        const editBtn = document.getElementById('editModeBtn');
        const formActions = document.getElementById('formActions');
        
        // Get all editable fields (not readonly or in non-editable groups)
        const editableFields = document.querySelectorAll('#profileForm input:not([readonly]), #profileForm select, #profileForm textarea');
        const photoBtn = document.getElementById('changePhotoBtn');
        
        editableFields.forEach(field => {
            // Skip fields that are in non-editable or restricted groups
            const isNonEditable = field.closest('.non-editable');
            const isRestricted = field.closest('.restricted');
            
            if (!isNonEditable && !isRestricted) {
                field.disabled = !this.isEditMode;
            }
        });
        
        // Handle photo button
        photoBtn.disabled = !this.isEditMode;
        
        if (this.isEditMode) {
            editBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
            editBtn.className = 'btn btn-secondary';
            formActions.style.display = 'flex';
        } else {
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
            editBtn.className = 'btn btn-primary';
            formActions.style.display = 'none';
        }
    }

    // Cancel Edit
    cancelEdit() {
        this.isEditMode = false;
        this.populateForm(this.currentProfessor); // Reset to original data
        this.toggleEditMode();
    }

    // Handle Form Submit
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.isEditMode) return;
        
        try {
            this.showLoading(true);
            
            const formData = new FormData(e.target);
            const updatedData = Object.fromEntries(formData.entries());
            
            // Add emergency contact as nested object
            updatedData.emergencyContact = {
                name: updatedData.emergencyName,
                phone: updatedData.emergencyPhone,
                relation: updatedData.emergencyRelation
            };
            
            // Remove individual emergency fields
            delete updatedData.emergencyName;
            delete updatedData.emergencyPhone;
            delete updatedData.emergencyRelation;
            
            const response = await this.simulateApiCall('/professor/profile', 'PUT', updatedData);
            
            if (response.success) {
                this.currentProfessor = { ...this.currentProfessor, ...updatedData };
                this.showSuccess('Profile updated successfully!');
                this.toggleEditMode();
            } else {
                this.showError('Failed to update profile: ' + response.message);
            }
        } catch (error) {
            this.showError('Error updating profile: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Handle Photo Change
    handlePhotoChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profilePhoto').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Open Change Request Modal
    openChangeRequestModal(fieldName) {
        const modal = document.getElementById('changeRequestModal');
        const fieldNameElement = document.getElementById('changeFieldName');
        const currentValue = document.getElementById(fieldName).value;
        
        fieldNameElement.textContent = this.getFieldDisplayName(fieldName);
        document.getElementById('newValue').value = currentValue;
        document.getElementById('changeReason').value = '';
        
        modal.style.display = 'block';
        modal.dataset.field = fieldName;
    }

    // Close Modal
    closeModal() {
        document.getElementById('changeRequestModal').style.display = 'none';
    }

    // Submit Change Request
    async submitChangeRequest() {
        const modal = document.getElementById('changeRequestModal');
        const fieldName = modal.dataset.field;
        const reason = document.getElementById('changeReason').value.trim();
        const newValue = document.getElementById('newValue').value.trim();
        
        if (!reason) {
            this.showError('Please provide a reason for the change request.');
            return;
        }
        
        try {
            const requestData = {
                professorId: this.currentProfessor.professorId,
                fieldName: fieldName,
                currentValue: document.getElementById(fieldName).value,
                requestedValue: newValue,
                reason: reason,
                status: 'pending',
                requestDate: new Date().toISOString()
            };
            
            const response = await this.simulateApiCall('/professor/change-request', 'POST', requestData);
            
            if (response.success) {
                this.showSuccess('Change request submitted successfully! It will be reviewed by an administrator.');
                this.closeModal();
                await this.loadPendingRequests();
            } else {
                this.showError('Failed to submit change request: ' + response.message);
            }
        } catch (error) {
            this.showError('Error submitting change request: ' + error.message);
        }
    }

    // Load Pending Requests
    async loadPendingRequests() {
        try {
            const response = await this.simulateApiCall('/professor/change-requests', 'GET');
            
            if (response.success) {
                this.pendingRequests = response.data;
                this.displayPendingRequests();
            }
        } catch (error) {
            console.error('Error loading pending requests:', error);
        }
    }

    // Display Pending Requests
    displayPendingRequests() {
        const requestsContainer = document.getElementById('pendingRequests');
        const requestsList = document.getElementById('requestsList');
        
        if (this.pendingRequests.length === 0) {
            requestsContainer.style.display = 'none';
            return;
        }
        
        requestsContainer.style.display = 'block';
        requestsList.innerHTML = '';
        
        this.pendingRequests.forEach(request => {
            const requestElement = document.createElement('div');
            requestElement.className = 'request-item';
            
            requestElement.innerHTML = `
                <div class="request-info">
                    <h4>${this.getFieldDisplayName(request.fieldName)}</h4>
                    <p><strong>Current:</strong> ${request.currentValue || 'N/A'}</p>
                    <p><strong>Requested:</strong> ${request.requestedValue}</p>
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

    // Utility Functions
    getFieldDisplayName(fieldName) {
        const fieldNames = {
            'nic': 'NIC Number',
            'department': 'Department',
            'dateOfJoin': 'Date of Joining'
        };
        return fieldNames[fieldName] || fieldName;
    }

    showLoading(show) {
        document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    }

    showForm(show) {
        document.getElementById('profileForm').style.display = show ? 'block' : 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        
        // Hide success message
        document.getElementById('successMessage').style.display = 'none';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        successText.textContent = message;
        successDiv.style.display = 'block';
        
        // Hide error message
        document.getElementById('errorMessage').style.display = 'none';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Redirect to login page or clear session
            window.location.href = '/login.html';
        }
    }

    // Simulated API calls - Replace with actual API calls
    async simulateApiCall(endpoint, method, data = null) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock responses based on endpoint
        if (endpoint === '/professor/profile' && method === 'GET') {
            return {
                success: true,
                data: {
                    professorId: 'PROF001',
                    professorName: 'Dr. John Smith',
                    nic: '123456789V',
                    email: 'john.smith@university.edu',
                    phoneNumber: '+1234567890',
                    department: 'computer-science',
                    designation: 'associate-professor',
                    dateOfJoin: '2020-01-15',
                    status: 'active',
                    degree: 'Ph.D. in Computer Science',
                    specialization: 'Machine Learning, Artificial Intelligence, Data Mining',
                    publications: 'Published 25+ research papers in top-tier conferences and journals including IEEE, ACM, and Springer.',
                    coursesTaught: 'Data Structures, Algorithms, Machine Learning, Database Systems, Software Engineering',
                    address: '123 University Street, Academic City, State 12345',
                    emergencyContact: {
                        name: 'Jane Smith',
                        phone: '+1234567891',
                        relation: 'Spouse'
                    },
                    photo: 'https://via.placeholder.com/150'
                }
            };
        }
        
        if (endpoint === '/professor/profile' && method === 'PUT') {
            return { success: true, message: 'Profile updated successfully' };
        }
        
        if (endpoint === '/professor/change-request' && method === 'POST') {
            return { success: true, message: 'Change request submitted' };
        }
        
        if (endpoint === '/professor/change-requests' && method === 'GET') {
            return {
                success: true,
                data: [
                    {
                        id: 1,
                        fieldName: 'department',
                        currentValue: 'Computer Science',
                        requestedValue: 'Information Technology',
                        reason: 'Department restructuring',
                        status: 'pending',
                        requestDate: new Date().toISOString()
                    }
                ]
            };
        }
        
        return { success: false, message: 'Unknown endpoint' };
    }

    // Real API call method - Use this when implementing with actual backend
    async makeApiCall(endpoint, method, data = null) {
        const url = `${this.API_BASE_URL}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth token if needed
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfessorProfileManager();
});

// Backend API Endpoints Documentation
/*
Required Backend API Endpoints:

1. GET /api/professor/profile
   - Returns professor profile data
   - Authentication required

2. PUT /api/professor/profile
   - Updates professor profile (editable fields only)
   - Authentication required
   - Body: JSON with updated fields

3. POST /api/professor/change-request
   - Submits change request for restricted fields
   - Authentication required
   - Body: { fieldName, currentValue, requestedValue, reason }

4. GET /api/professor/change-requests
   - Returns pending change requests for the professor
   - Authentication required

5. POST /api/upload/photo
   - Uploads profile photo
   - Authentication required
   - Body: FormData with photo file

Database Schema Suggestions:

1. professors table:
   - professorId (Primary Key)
   - professorName
   - nic
   - email
   - phoneNumber
   - department
   - designation
   - dateOfJoin
   - status
   - degree
   - specialization
   - publications
   - coursesTaught
   - address
   - photo (URL/path)
   - emergencyContactName
   - emergencyContactPhone
   - emergencyContactRelation
   - created_at
   - updated_at

2. change_requests table:
   - id (Primary Key)
   - professorId (Foreign Key)
   - fieldName
   - currentValue
   - requestedValue
   - reason
   - status (pending/approved/rejected)
   - requestDate
   - reviewDate
   - reviewedBy (admin user id)
   - comments
   - created_at
   - updated_at
*/
