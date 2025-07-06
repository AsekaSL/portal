
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professor Profile Management</title>
    <link rel="stylesheet" href="../../styles/admin/professor-profile.css">
    <script src="../../controller/professor/professor-profile.js"></script>
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1><i class="fas fa-user-graduate"></i> Professor Profile Management</h1>
            <div class="header-actions">
                <button id="editModeBtn" class="btn btn-primary">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
                <button id="logoutBtn" class="btn btn-secondary">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </header>

        <div class="profile-container">
            <!-- Loading Spinner -->
            <div id="loadingSpinner" class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading profile...</p>
            </div>

            <!-- Error Message -->
            <div id="errorMessage" class="error-message" style="display: none;">
                <i class="fas fa-exclamation-triangle"></i>
                <span id="errorText"></span>
            </div>

            <!-- Success Message -->
            <div id="successMessage" class="success-message" style="display: none;">
                <i class="fas fa-check-circle"></i>
                <span id="successText"></span>
            </div>

            <!-- Profile Form -->
            <form id="profileForm" class="profile-form" style="display: none;">
                <!-- Photo Section -->
                <div class="photo-section">
                    <div class="photo-container">
                        <img id="profilePhoto" src="https://via.placeholder.com/150" alt="Professor Photo" class="profile-photo">
                        <div class="photo-overlay">
                            <button type="button" id="changePhotoBtn" class="photo-btn" disabled>
                                <i class="fas fa-camera"></i>
                            </button>
                        </div>
                    </div>
                    <input type="file" id="photoInput" accept="image/*" style="display: none;">
                </div>

                <!-- Basic Information -->
                <div class="form-section">
                    <h3><i class="fas fa-user"></i> Basic Information</h3>
                    <div class="form-grid">
                        <div class="form-group non-editable">
                            <label for="professorId">Professor ID</label>
                            <input type="text" id="professorId" name="professorId" readonly>
                            <i class="fas fa-lock"></i>
                        </div>
                        
                        <div class="form-group">
                            <label for="professorName">Full Name *</label>
                            <input type="text" id="professorName" name="professorName" required disabled>
                        </div>
                        
                        <div class="form-group restricted">
                            <label for="nic">NIC Number</label>
                            <input type="text" id="nic" name="nic" readonly>
                            <button type="button" class="request-change-btn" data-field="nic">
                                <i class="fas fa-key"></i> Request Change
                            </button>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" required disabled>
                        </div>
                        
                        <div class="form-group">
                            <label for="phoneNumber">Phone Number *</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" required disabled>
                        </div>
                        
                        <div class="form-group restricted">
                            <label for="department">Department</label>
                            <select id="department" name="department" disabled>
                                <option value="">Select Department</option>
                                <option value="computer-science">Computer Science</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                                <option value="biology">Biology</option>
                                <option value="engineering">Engineering</option>
                            </select>
                            <button type="button" class="request-change-btn" data-field="department">
                                <i class="fas fa-key"></i> Request Change
                            </button>
                        </div>
                        
                        <div class="form-group">
                            <label for="designation">Designation</label>
                            <select id="designation" name="designation" disabled>
                                <option value="">Select Designation</option>
                                <option value="lecturer">Lecturer</option>
                                <option value="senior-lecturer">Senior Lecturer</option>
                                <option value="assistant-professor">Assistant Professor</option>
                                <option value="associate-professor">Associate Professor</option>
                                <option value="professor">Professor</option>
                            </select>
                        </div>
                        
                        <div class="form-group restricted">
                            <label for="dateOfJoin">Date of Joining</label>
                            <input type="date" id="dateOfJoin" name="dateOfJoin" readonly>
                            <button type="button" class="request-change-btn" data-field="dateOfJoin">
                                <i class="fas fa-key"></i> Request Change
                            </button>
                        </div>
                        
                        <div class="form-group non-editable">
                            <label for="status">Status</label>
                            <select id="status" name="status" disabled>
                                <option value="active">Active</option>
                                <option value="leave">On Leave</option>
                                <option value="retired">Retired</option>
                                <option value="resigned">Resigned</option>
                            </select>
                            <i class="fas fa-lock"></i>
                        </div>
                    </div>
                </div>

                <!-- Academic Information -->
                <div class="form-section">
                    <h3><i class="fas fa-graduation-cap"></i> Academic Information</h3>
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label for="degree">Highest Degree</label>
                            <input type="text" id="degree" name="degree" placeholder="e.g., Ph.D. in Computer Science" disabled>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="specialization">Specialization</label>
                            <textarea id="specialization" name="specialization" rows="3" placeholder="Areas of expertise..." disabled></textarea>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="publications">Publications</label>
                            <textarea id="publications" name="publications" rows="4" placeholder="List of publications..." disabled></textarea>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="coursesTaught">Courses Taught</label>
                            <textarea id="coursesTaught" name="coursesTaught" rows="3" placeholder="List of courses..." disabled></textarea>
                        </div>
                    </div>
                </div>

                <!-- Address Information -->
                <div class="form-section">
                    <h3><i class="fas fa-home"></i> Address Information</h3>
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label for="address">Full Address</label>
                            <textarea id="address" name="address" rows="3" placeholder="Complete address..." disabled></textarea>
                        </div>
                    </div>
                </div>

                <!-- Emergency Contact -->
                <div class="form-section">
                    <h3><i class="fas fa-phone-alt"></i> Emergency Contact</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="emergencyName">Contact Name</label>
                            <input type="text" id="emergencyName" name="emergencyName" placeholder="Emergency contact name" disabled>
                        </div>
                        
                        <div class="form-group">
                            <label for="emergencyPhone">Contact Phone</label>
                            <input type="tel" id="emergencyPhone" name="emergencyPhone" placeholder="Emergency contact phone" disabled>
                        </div>
                        
                        <div class="form-group">
                            <label for="emergencyRelation">Relationship</label>
                            <input type="text" id="emergencyRelation" name="emergencyRelation" placeholder="Relationship" disabled>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="form-actions" id="formActions" style="display: none;">
                    <button type="button" id="cancelBtn" class="btn btn-secondary">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="submit" id="saveBtn" class="btn btn-success">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </form>
        </div>

        <!-- Change Request Modal -->
        <div id="changeRequestModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-key"></i> Request Field Change</h3>
                    <button type="button" class="close-btn" id="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>You are requesting to change: <strong id="changeFieldName"></strong></p>
                    <div class="form-group">
                        <label for="changeReason">Reason for Change *</label>
                        <textarea id="changeReason" rows="4" placeholder="Please provide a detailed reason for this change request..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="newValue">Proposed New Value</label>
                        <input type="text" id="newValue" placeholder="Enter the new value you want">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="cancelRequest" class="btn btn-secondary">Cancel</button>
                    <button type="button" id="submitRequest" class="btn btn-primary">Submit Request</button>
                </div>
            </div>
        </div>

        <!-- Pending Requests Section -->
        <div id="pendingRequests" class="pending-requests" style="display: none;">
            <h3><i class="fas fa-clock"></i> Pending Change Requests</h3>
            <div id="requestsList" class="requests-list">
                <!-- Requests will be populated here -->
            </div>
        </div>
    </div>

    
</body>
</html>
