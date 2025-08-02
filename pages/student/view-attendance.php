<div class="attendance-view">
    <!-- Date Range Filter -->
    <div class="date-filter-section">
        <div class="date-filter-card">
            <h3><i class="fas fa-calendar-alt"></i>Select Date Range</h3>
            <div class="date-inputs">
                <div class="date-group">
                    <label for="startDate">From Date</label>
                    <input type="text" id="startDate" placeholder="Select start date" readonly>
                </div>
                <div class="date-group">
                    <label for="endDate">To Date</label>
                    <input type="text" id="endDate" placeholder="Select end date" readonly>
                </div>
                <button class="btn btn-primary" onclick="filterAttendance()">
                    <i class="fas fa-filter"></i>
                    Apply Filter
                </button>
            </div>
        </div>
    </div>

    <!-- Loading Spinner -->
    <div id="loadingSpinner" class="loading-spinner" style="display: none;">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading attendance data...</p>
    </div>

    <!-- Error Message -->
    <div id="errorMessage" class="error-message" style="display: none;">
        <i class="fas fa-exclamation-triangle"></i>
        <span id="errorText"></span>
    </div>

    <!-- Courses Grid -->
    <div id="coursesContainer" class="courses-container">
        <!-- Course cards will be populated by JavaScript -->
    </div>

    <!-- Overall Statistics -->
    <div class="stats-section">
        <h3><i class="fas fa-chart-pie"></i>Overall Attendance Statistics</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="stat-info">
                    <h4 id="totalCourses">0</h4>
                    <p>Total Courses</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h4 id="avgAttendance">0%</h4>
                    <p>Average Attendance</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-calendar-day"></i>
                </div>
                <div class="stat-info">
                    <h4 id="totalDays">0</h4>
                    <p>Total Conducted Days</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="stat-info">
                    <h4 id="lowAttendanceCourses">0</h4>
                    <p>Low Attendance Courses</p>
                </div>
            </div>
        </div>
    </div>
</div>
</div>