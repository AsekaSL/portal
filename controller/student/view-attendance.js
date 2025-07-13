// Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Update this to your backend URL
const STUDENT_ID = localStorage.getItem('studentId') || '12345'; // Get from login session

// Global variables
let attendanceData = [];
let chartsInstances = {};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePickers();
    loadAttendanceData();
});

// Initialize Flatpickr date pickers
function initializeDatePickers() {
    const startDatePicker = flatpickr("#startDate", {
        dateFormat: "Y-m-d",
        defaultDate: getDateWeeksAgo(4), // Default to 4 weeks ago
        onChange: function(selectedDates, dateStr, instance) {
            // Update end date minimum
            if (selectedDates[0]) {
                endDatePicker.set('minDate', selectedDates[0]);
            }
        }
    });

    const endDatePicker = flatpickr("#endDate", {
        dateFormat: "Y-m-d",
        defaultDate: new Date(), // Default to today
        onChange: function(selectedDates, dateStr, instance) {
            // Update start date maximum
            if (selectedDates[0]) {
                startDatePicker.set('maxDate', selectedDates[0]);
            }
        }
    });
}

// Helper function to get date weeks ago
function getDateWeeksAgo(weeks) {
    const date = new Date();
    date.setDate(date.getDate() - (weeks * 7));
    return date;
}

// Load attendance data from backend
async function loadAttendanceData() {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}/attendance`, {
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
        attendanceData = data.courses || [];
        
        renderCourses();
        updateOverallStats();
        
    } catch (error) {
        console.error('Error loading attendance data:', error);
        showError('Failed to load attendance data. Please try again later.');
        
        // Use mock data for development
        loadMockData();
    } finally {
        showLoading(false);
    }
}

// Load mock data for development
function loadMockData() {
    console.log('Loading mock data for development...');
    attendanceData = [
        {
            courseId: 'CS101',
            courseName: 'Introduction to Computer Science',
            courseCode: 'CS101',
            instructor: 'Dr. Smith',
            totalClasses: 45,
            presentClasses: 38,
            absentClasses: 7,
            attendancePercentage: 84.4,
            status: 'active'
        },
        {
            courseId: 'MATH201',
            courseName: 'Calculus II',
            courseCode: 'MATH201',
            instructor: 'Prof. Johnson',
            totalClasses: 40,
            presentClasses: 32,
            absentClasses: 8,
            attendancePercentage: 80.0,
            status: 'active'
        },
        {
            courseId: 'PHY301',
            courseName: 'Quantum Physics',
            courseCode: 'PHY301',
            instructor: 'Dr. Williams',
            totalClasses: 35,
            presentClasses: 24,
            absentClasses: 11,
            attendancePercentage: 68.6,
            status: 'warning'
        },
        {
            courseId: 'ENG102',
            courseName: 'Technical Writing',
            courseCode: 'ENG102',
            instructor: 'Ms. Brown',
            totalClasses: 30,
            presentClasses: 28,
            absentClasses: 2,
            attendancePercentage: 93.3,
            status: 'active'
        }
    ];
    
    renderCourses();
    updateOverallStats();
}

// Filter attendance data by date range
async function filterAttendance() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        showError('Please select both start and end dates.');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showError('Start date cannot be later than end date.');
        return;
    }

    try {
        showLoading(true);
        hideError();

        const response = await fetch(`${API_BASE_URL}/student/${STUDENT_ID}/attendance?startDate=${startDate}&endDate=${endDate}`, {
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
        attendanceData = data.courses || [];
        
        renderCourses();
        updateOverallStats();
        
    } catch (error) {
        console.error('Error filtering attendance data:', error);
        showError('Failed to filter attendance data. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Render course cards
function renderCourses() {
    const container = document.getElementById('coursesContainer');
    
    if (attendanceData.length === 0) {
        container.innerHTML = `
            <div class="no-data" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6c757d;">
                <i class="fas fa-graduation-cap" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>No courses found</h3>
                <p>You are not enrolled in any courses for the selected date range.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = attendanceData.map(course => `
        <div class="course-card">
            <div class="course-header">
                <div class="course-info">
                    <h3>${course.courseName}</h3>
                    <p>${course.courseCode} - ${course.instructor}</p>
                </div>
                <div class="course-status ${getStatusClass(course.status)}">
                    ${course.status}
                </div>
            </div>
            
            <div class="attendance-stats">
                <div class="stat-item">
                    <h4 class="present">${course.presentClasses}</h4>
                    <p>Present</p>
                </div>
                <div class="stat-item">
                    <h4 class="absent">${course.absentClasses}</h4>
                    <p>Absent</p>
                </div>
                <div class="stat-item">
                    <h4 class="total">${course.totalClasses}</h4>
                    <p>Total</p>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="chart-${course.courseId}"></canvas>
            </div>
            
            <div class="attendance-percentage ${getPercentageClass(course.attendancePercentage)}">
                ${course.attendancePercentage.toFixed(1)}% Attendance
            </div>
        </div>
    `).join('');

    // Create pie charts for each course
    setTimeout(() => {
        attendanceData.forEach(course => {
            createPieChart(course);
        });
    }, 100);
}

// Create pie chart for a course
function createPieChart(course) {
    const chartId = `chart-${course.courseId}`;
    const ctx = document.getElementById(chartId);
    
    if (!ctx) {
        console.error(`Canvas element not found: ${chartId}`);
        return;
    }

    // Destroy existing chart if exists
    if (chartsInstances[chartId]) {
        chartsInstances[chartId].destroy();
    }

    chartsInstances[chartId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [course.presentClasses, course.absentClasses],
                backgroundColor: [
                    '#28a745',
                    '#dc3545'
                ],
                borderColor: [
                    '#ffffff',
                    '#ffffff'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = course.totalClasses;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Update overall statistics
function updateOverallStats() {
    const totalCourses = attendanceData.length;
    const totalClasses = attendanceData.reduce((sum, course) => sum + course.totalClasses, 0);
    const totalPresent = attendanceData.reduce((sum, course) => sum + course.presentClasses, 0);
    const avgAttendance = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : 0;
    const lowAttendanceCourses = attendanceData.filter(course => course.attendancePercentage < 75).length;

    document.getElementById('totalCourses').textContent = totalCourses;
    document.getElementById('avgAttendance').textContent = `${avgAttendance}%`;
    document.getElementById('totalDays').textContent = totalClasses;
    document.getElementById('lowAttendanceCourses').textContent = lowAttendanceCourses;
}

// Helper functions
function getStatusClass(status) {
    switch (status) {
        case 'active':
            return 'status-active';
        case 'warning':
            return 'status-warning';
        case 'danger':
            return 'status-danger';
        default:
            return 'status-active';
    }
}

function getPercentageClass(percentage) {
    if (percentage >= 90) return 'percentage-excellent';
    if (percentage >= 80) return 'percentage-good';
    if (percentage >= 75) return 'percentage-warning';
    return 'percentage-danger';
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

function refreshData() {
    loadAttendanceData();
}

// Export functions for testing
window.attendanceDashboard = {
    loadAttendanceData,
    filterAttendance,
    refreshData
};