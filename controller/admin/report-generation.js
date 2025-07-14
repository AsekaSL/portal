(() => {
    // Mock data for dropdowns and students - replace with real API calls
    const courseModules = ["Math 101", "Physics 201", "Chemistry 301"];
    const years = ["2021", "2022", "2023"];
    const semesters = ["1", "2", "3", "4", "5", "6"];
    const faculties = ["Science", "Engineering", "Arts"];
    const departments = ["Computer Science", "Mechanical", "Physics", "Chemistry"];

    // Mock student database for search by ID
    const studentsDB = {
        "S001": { name: "Alice Johnson", faculty: "Science", year: "2022" },
        "S002": { name: "Bob Smith", faculty: "Engineering", year: "2023" },
        "S003": { name: "Charlie Lee", faculty: "Science", year: "2021" },
        "S004": { name: "Diana Prince", faculty: "Arts", year: "2022" },
        "S005": { name: "Ethan Hunt", faculty: "Engineering", year: "2021" },
        "S006": { name: "Fiona Gallagher", faculty: "Science", year: "2023" },
    };

    // Elements
    const courseModuleSelect = document.getElementById("courseModule");
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const facultySelect = document.getElementById("faculty");
    const departmentSelect = document.getElementById("department");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const enableStudentSearchCheckbox = document.getElementById("enableStudentSearch");
    const studentIdInput = document.getElementById("studentId");
    const searchIcon = document.getElementById("searchIcon");
    const reportForm = document.getElementById("reportForm");
    const loadingDiv = document.getElementById("loading");
    const errorDiv = document.getElementById("error");
    const reportTable = document.getElementById("reportTable");
    const reportTbody = reportTable.querySelector("tbody");
    const chartContainer = document.getElementById("chartContainer");
    const downloadPDFBtn = document.getElementById("downloadPDF");
    const studentIdsDatalist = document.getElementById("studentIds");

    let pieChart = null;
    let currentReportData = [];

    // Populate dropdowns
    function populateSelect(selectElem, options) {
        options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            selectElem.appendChild(option);
        });
    }

    populateSelect(courseModuleSelect, courseModules);
    populateSelect(yearSelect, years);
    populateSelect(semesterSelect, semesters);
    populateSelect(facultySelect, faculties);
    populateSelect(departmentSelect, departments);

    // Populate datalist for student IDs
    function populateStudentIds() {
        Object.keys(studentsDB).forEach(id => {
            const option = document.createElement("option");
            option.value = id;
            studentIdsDatalist.appendChild(option);
        });
    }
    populateStudentIds();

    // Enable/disable student ID input and toggle search icon
    enableStudentSearchCheckbox.addEventListener("change", () => {
        const enabled = enableStudentSearchCheckbox.checked;
        studentIdInput.disabled = !enabled;
        searchIcon.classList.toggle("active", enabled);
        if (!enabled) {
            studentIdInput.value = "";
            facultySelect.value = "";
            yearSelect.value = "";
            facultySelect.disabled = false;
            yearSelect.disabled = false;
        } else {
            facultySelect.disabled = true;
            yearSelect.disabled = true;
        }
        clearReport();
    });

    // Search student by ID and autofill faculty and year
    function searchStudentById(studentId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (studentsDB[studentId]) {
                    resolve(studentsDB[studentId]);
                } else {
                    reject("Student not found.");
                }
            }, 500);
        });
    }

    // Handle search icon click or Enter key in student ID input
    function handleStudentSearch() {
        const studentId = studentIdInput.value.trim();
        if (!studentId) {
            showError("Please enter a Student ID to search.");
            return;
        }
        showError("");
        loading(true);
        searchStudentById(studentId)
            .then(student => {
                facultySelect.value = student.faculty;
                yearSelect.value = student.year;
                loading(false);
            })
            .catch(err => {
                showError(err);
                facultySelect.value = "";
                yearSelect.value = "";
                loading(false);
            });
    }

    searchIcon.addEventListener("click", handleStudentSearch);
    studentIdInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleStudentSearch();
        }
    });

    // Show/hide loading
    function loading(show) {
        loadingDiv.style.display = show ? "block" : "none";
    }
    // Show error message
    function showError(msg) {
        if (msg) {
            errorDiv.textContent = msg;
            errorDiv.style.display = "block";
        } else {
            errorDiv.textContent = "";
            errorDiv.style.display = "none";
        }
    }

    // Clear report display
    function clearReport() {
        reportTbody.innerHTML = "";
        reportTable.style.display = "none";
        chartContainer.style.display = "none";
        downloadPDFBtn.style.display = "none";
        if (pieChart) {
            pieChart.destroy();
            pieChart = null;
        }
        currentReportData = [];
    }

    // Simulate fetching attendance report from backend
    function fetchAttendanceReport(filters) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const students = Object.entries(studentsDB).map(([id, info]) => ({
                    id,
                    name: info.name,
                    faculty: info.faculty,
                    year: info.year,
                }));

                let filteredStudents = students.filter(s =>
                    s.faculty === filters.faculty &&
                    s.year === filters.year &&
                    (filters.department ? filters.department === filters.department : true) &&
                    (filters.courseModule ? filters.courseModule === filters.courseModule : true) &&
                    (filters.semester ? filters.semester === filters.semester : true)
                );

                if (filters.studentId) {
                    filteredStudents = filteredStudents.filter(s => s.id === filters.studentId);
                }

                // For demo, generate random attendance data for each student
                const reportData = filteredStudents.map(s => {
                    const totalDays = 10; // example total days in range
                    const presentDays = Math.floor(Math.random() * (totalDays + 1));
                    return {
                        ...s,
                        attendancePercent: ((presentDays / totalDays) * 100).toFixed(2),
                        presentDays,
                        absentDays: totalDays - presentDays,
                    };
                });

                resolve(reportData);
            }, 1000);
        });
    }

    // Render report table
    function renderReportTable(data) {
        clearReport();
        if (!data.length) {
            showError("No attendance records found.");
            return;
        }
        showError("");
        data.forEach(({ id, name, attendancePercent, presentDays, absentDays }) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${attendancePercent}%</td>
        <td>${presentDays}</td>
        <td>${absentDays}</td>
      `;
            reportTbody.appendChild(tr);
        });
        reportTable.style.display = "table";
    }

    // Render pie chart for attendance summary
    function renderPieChart(data) {
        let totalPresent = 0;
        let totalAbsent = 0;
        data.forEach(d => {
            totalPresent += d.presentDays;
            totalAbsent += d.absentDays;
        });

        if (pieChart) pieChart.destroy();

        const ctx = document.getElementById("attendancePieChart").getContext("2d");
        pieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Present", "Absent"],
                datasets: [{
                    data: [totalPresent, totalAbsent],
                    backgroundColor: ["#28a745", "#dc3545"],
                    hoverOffset: 20,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { font: { size: 14 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.label}: ${ctx.parsed} days`
                        }
                    }
                }
            }
        });

        chartContainer.style.display = "block";
    }

    // Generate PDF report using jsPDF
    async function generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Attendance Report", 14, 22);

        let startY = 30;
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, startY);
        startY += 10;

        // Table headers
        const headers = ["Student ID", "Name", "Attendance %", "Present Days", "Absent Days"];
        const rows = data.map(d => [d.id, d.name, d.attendancePercent + "%", d.presentDays.toString(), d.absentDays.toString()]);

        // Use jsPDF autoTable plugin if available
        if (doc.autoTable) {
            doc.autoTable({
                startY,
                head: [headers],
                body: rows,
                theme: 'striped',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [0, 123, 255] },
            });
        } else {
            // Basic fallback table (less pretty)
            doc.text(headers.join(" | "), 14, startY);
            startY += 8;
            rows.forEach(row => {
                doc.text(row.join(" | "), 14, startY);
                startY += 8;
            });
        }

        // Pie chart image
        const canvas = document.getElementById("attendancePieChart");
        const imgData = canvas.toDataURL("image/png");
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Attendance Summary", 14, 20);
        doc.addImage(imgData, "PNG", 40, 30, 120, 120);

        doc.save("Attendance_Report.pdf");
    }

    // Form submission handler
    reportForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearReport();
        showError("");

        // Validate date range
        if (startDateInput.value > endDateInput.value) {
            showError("Start Date cannot be after End Date.");
            return;
        }

        // Gather filters
        const filters = {
            courseModule: courseModuleSelect.value,
            year: yearSelect.value,
            semester: semesterSelect.value,
            faculty: facultySelect.value,
            department: departmentSelect.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            studentId: enableStudentSearchCheckbox.checked ? studentIdInput.value.trim() : null,
        };

        // If student search enabled, studentId must be filled
        if (enableStudentSearchCheckbox.checked && !filters.studentId) {
            showError("Please enter a Student ID to search.");
            return;
        }

        loading(true);
        try {
            const reportData = await fetchAttendanceReport(filters);
            currentReportData = reportData;
            renderReportTable(reportData);
            renderPieChart(reportData);
            downloadPDFBtn.style.display = reportData.length ? "inline-block" : "none";
        } catch (err) {
            showError("Failed to fetch attendance data. Please try again.");
        }
        loading(false);
    });

    downloadPDFBtn.addEventListener("click", () => {
        if (currentReportData.length) {
            generatePDF(currentReportData);
        }
    });
})();


/*
(() => {
  // API Configuration - Replace with your actual backend URLs
  const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your backend URL
  
  // API Endpoints
  const API_ENDPOINTS = {
    courseModules: `${API_BASE_URL}/course-modules`,
    years: `${API_BASE_URL}/academic-years`,
    semesters: `${API_BASE_URL}/semesters`,
    faculties: `${API_BASE_URL}/faculties`,
    departments: `${API_BASE_URL}/departments`,
    students: `${API_BASE_URL}/students`,
    attendanceReport: `${API_BASE_URL}/attendance/report`,
    studentSearch: `${API_BASE_URL}/students/search`
  };

  // Elements
  const courseModuleSelect = document.getElementById("courseModule");
  const yearSelect = document.getElementById("year");
  const semesterSelect = document.getElementById("semester");
  const facultySelect = document.getElementById("faculty");
  const departmentSelect = document.getElementById("department");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const enableStudentSearchCheckbox = document.getElementById("enableStudentSearch");
  const studentIdInput = document.getElementById("studentId");
  const searchIcon = document.getElementById("searchIcon");
  const reportForm = document.getElementById("reportForm");
  const loadingDiv = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const reportTable = document.getElementById("reportTable");
  const reportTbody = reportTable.querySelector("tbody");
  const chartContainer = document.getElementById("chartContainer");
  const downloadPDFBtn = document.getElementById("downloadPDF");
  const studentIdsDatalist = document.getElementById("studentIds");
  const reportSummary = document.getElementById("reportSummary");

  let pieChart = null;
  let currentReportData = [];
  let currentFilters = {};

  // API call wrapper with error handling
  async function apiCall(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Populate dropdown from API
  async function populateSelectFromAPI(selectElem, endpoint, valueField = 'id', textField = 'name') {
    try {
      const data = await apiCall(endpoint);
      selectElem.innerHTML = '<option value="">Select...</option>';
      
      data.forEach(item => {
        const option = document.createElement("option");
        option.value = item[valueField];
        option.textContent = item[textField];
        selectElem.appendChild(option);
      });
    } catch (error) {
      console.error(`Failed to load data for ${selectElem.id}:`, error);
      showError(`Failed to load ${selectElem.id} options. Please refresh the page.`);
    }
  }

  // Initialize all dropdowns
  async function initializeDropdowns() {
    try {
      loading(true);
      await Promise.all([
        populateSelectFromAPI(courseModuleSelect, API_ENDPOINTS.courseModules, 'id', 'name'),
        populateSelectFromAPI(yearSelect, API_ENDPOINTS.years, 'year', 'year'),
        populateSelectFromAPI(semesterSelect, API_ENDPOINTS.semesters, 'id', 'name'),
        populateSelectFromAPI(facultySelect, API_ENDPOINTS.faculties, 'id', 'name'),
        populateSelectFromAPI(departmentSelect, API_ENDPOINTS.departments, 'id', 'name')
      ]);
      loading(false);
    } catch (error) {
      loading(false);
      showError('Failed to initialize form data. Please refresh the page.');
    }
  }

  // Load students for datalist
  async function loadStudentIds() {
    try {
      const students = await apiCall(API_ENDPOINTS.students);
      studentIdsDatalist.innerHTML = '';
      
      students.forEach(student => {
        const option = document.createElement("option");
        option.value = student.studentId;
        option.textContent = `${student.studentId} - ${student.name}`;
        studentIdsDatalist.appendChild(option);
      });
    } catch (error) {
      console.error('Failed to load student IDs:', error);
    }
  }

  // Enable/disable student ID input and toggle search icon
  enableStudentSearchCheckbox.addEventListener("change", () => {
    const enabled = enableStudentSearchCheckbox.checked;
    studentIdInput.disabled = !enabled;
    searchIcon.classList.toggle("active", enabled);
    if (!enabled) {
      studentIdInput.value = "";
      facultySelect.value = "";
      yearSelect.value = "";
      facultySelect.disabled = false;
      yearSelect.disabled = false;
    } else {
      facultySelect.disabled = true;
      yearSelect.disabled = true;
    }
    clearReport();
  });

  // Search student by ID
  async function searchStudentById(studentId) {
    try {
      const response = await apiCall(`${API_ENDPOINTS.studentSearch}?id=${encodeURIComponent(studentId)}`);
      return response;
    } catch (error) {
      throw new Error('Student not found or server error');
    }
  }

  // Handle search icon click or Enter key in student ID input
  function handleStudentSearch() {
    const studentId = studentIdInput.value.trim();
    if (!studentId) {
      showError("Please enter a Student ID to search.");
      return;
    }
    showError("");
    loading(true);
    
    searchStudentById(studentId)
      .then(student => {
        facultySelect.value = student.facultyId;
        yearSelect.value = student.year;
        loading(false);
      })
      .catch(err => {
        showError(err.message);
        facultySelect.value = "";
        yearSelect.value = "";
        loading(false);
      });
  }

  searchIcon.addEventListener("click", handleStudentSearch);
  studentIdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleStudentSearch();
    }
  });

  // Show/hide loading
  function loading(show) {
    loadingDiv.style.display = show ? "block" : "none";
  }

  // Show error message
  function showError(msg) {
    if (msg) {
      errorDiv.textContent = msg;
      errorDiv.style.display = "block";
    } else {
      errorDiv.textContent = "";
      errorDiv.style.display = "none";
    }
  }

  // Clear report display
  function clearReport() {
    reportTbody.innerHTML = "";
    reportTable.style.display = "none";
    chartContainer.style.display = "none";
    reportSummary.style.display = "none";
    downloadPDFBtn.style.display = "none";
    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }
    currentReportData = [];
  }

  // Fetch attendance report from backend
  async function fetchAttendanceReport(filters) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await apiCall(`${API_ENDPOINTS.attendanceReport}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch attendance data from server');
    }
  }

  // Update summary statistics
  function updateSummary(data, filters) {
    const totalStudents = data.length;
    const totalPresent = data.reduce((sum, student) => sum + student.presentDays, 0);
    const totalPossible = data.reduce((sum, student) => sum + (student.presentDays + student.absentDays), 0);
    const avgAttendance = totalPossible > 0 ? ((totalPresent / totalPossible) * 100).toFixed(1) : 0;
    
    const startDate = moment(filters.startDate);
    const endDate = moment(filters.endDate);
    const daysDiff = endDate.diff(startDate, 'days') + 1;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('avgAttendance').textContent = `${avgAttendance}%`;
    document.getElementById('totalClasses').textContent = totalPossible / totalStudents || 0;
    document.getElementById('dateRange').textContent = daysDiff;

    reportSummary.style.display = 'block';
  }

  // Render report table
  function renderReportTable(data) {
    clearReport();
    if (!data.length) {
      showError("No attendance records found for the selected criteria.");
      return;
    }
    
    showError("");
    data.forEach(student => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${student.studentId}</td>
        <td>${student.name}</td>
        <td>${student.email || 'N/A'}</td>
        <td>${student.attendancePercent}%</td>
        <td>${student.presentDays}</td>
        <td>${student.absentDays}</td>
        <td>${student.lateArrivals || 0}</td>
      `;
      reportTbody.appendChild(tr);
    });
    
    reportTable.style.display = "table";
    updateSummary(data, currentFilters);
  }

  // Render pie chart for attendance summary
  function renderPieChart(data) {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    
    data.forEach(d => {
      totalPresent += d.presentDays;
      totalAbsent += d.absentDays;
      totalLate += d.lateArrivals || 0;
    });

    if (pieChart) pieChart.destroy();

    const ctx = document.getElementById("attendancePieChart").getContext("2d");
    pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Present", "Absent", "Late Arrivals"],
        datasets: [{
          data: [totalPresent, totalAbsent, totalLate],
          backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
          hoverOffset: 20,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 14 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.parsed} days`
            }
          }
        }
      }
    });

    chartContainer.style.display = "block";
  }

  // Generate comprehensive PDF report
  async function generatePDF(data, filters) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 123, 255);
    doc.text("COMPREHENSIVE ATTENDANCE REPORT", 105, 20, { align: 'center' });
    
    // Report details
    let yPos = 35;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, 14, yPos);
    yPos += 8;
    doc.text(`Report Period: ${moment(filters.startDate).format('MMM DD, YYYY')} to ${moment(filters.endDate).format('MMM DD, YYYY')}`, 14, yPos);
    yPos += 8;
    
    if (filters.studentId) {
      doc.text(`Student ID: ${filters.studentId}`, 14, yPos);
      yPos += 8;
    }
    
    doc.text(`Faculty: ${facultySelect.options[facultySelect.selectedIndex].text}`, 14, yPos);
    yPos += 8;
    doc.text(`Department: ${departmentSelect.options[departmentSelect.selectedIndex].text}`, 14, yPos);
    yPos += 15;

    // Summary Statistics
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255);
    doc.text("SUMMARY STATISTICS", 14, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const totalStudents = data.length;
    const totalPresent = data.reduce((sum, student) => sum + student.presentDays, 0);
    const totalAbsent = data.reduce((sum, student) => sum + student.absentDays, 0);
    const totalLate = data.reduce((sum, student) => sum + (student.lateArrivals || 0), 0);
    const avgAttendance = ((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(2);

    const summaryData = [
      ['Total Students', totalStudents.toString()],
      ['Total Present Days', totalPresent.toString()],
      ['Total Absent Days', totalAbsent.toString()],
      ['Total Late Arrivals', totalLate.toString()],
      ['Average Attendance Rate', `${avgAttendance}%`],
      ['Report Date Range', `${moment(filters.startDate).format('MMM DD, YYYY')} - ${moment(filters.endDate).format('MMM DD, YYYY')}`]
    ];

    doc.autoTable({
      startY: yPos,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      margin: { left: 14 }
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Detailed Student Records
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255);
    doc.text("DETAILED STUDENT RECORDS", 14, yPos);
    yPos += 10;

    const headers = ["Student ID", "Name", "Email", "Attendance %", "Present", "Absent", "Late"];
    const rows = data.map(student => [
      student.studentId,
      student.name,
      student.email || 'N/A',
      `${student.attendancePercent}%`,
      student.presentDays.toString(),
      student.absentDays.toString(),
      (student.lateArrivals || 0).toString()
    ]);

    doc.autoTable({
      startY: yPos,
      head: [headers],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      margin: { left: 14, right: 14 }
    });

    // Add new page for charts and analysis
    doc.addPage();
    
    // Attendance Distribution Chart
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255);
    doc.text("ATTENDANCE ANALYSIS", 14, 20);

    // Add pie chart
    const canvas = document.getElementById("attendancePieChart");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 40, 30, 120, 120);
    }

    // Attendance ranges analysis
    const attendanceRanges = {
      'Excellent (90-100%)': 0,
      'Good (80-89%)': 0,
      'Average (70-79%)': 0,
      'Below Average (60-69%)': 0,
      'Poor (<60%)': 0
    };

    data.forEach(student => {
      const attendance = parseFloat(student.attendancePercent);
      if (attendance >= 90) attendanceRanges['Excellent (90-100%)']++;
      else if (attendance >= 80) attendanceRanges['Good (80-89%)']++;
      else if (attendance >= 70) attendanceRanges['Average (70-79%)']++;
      else if (attendance >= 60) attendanceRanges['Below Average (60-69%)']++;
      else attendanceRanges['Poor (<60%)']++;
    });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Attendance Distribution by Performance:", 14, 165);

    const rangeData = Object.entries(attendanceRanges).map(([range, count]) => [
      range, 
      count.toString(), 
      `${((count / totalStudents) * 100).toFixed(1)}%`
    ]);

    doc.autoTable({
      startY: 175,
      head: [['Performance Range', 'Students', 'Percentage']],
      body: rangeData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      margin: { left: 14 }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text('Generated by Academic Management System', 105, 285, { align: 'center' });
    }

    // Save the PDF
    const filename = filters.studentId 
      ? `Attendance_Report_${filters.studentId}_${moment().format('YYYY-MM-DD')}.pdf`
      : `Attendance_Report_${moment().format('YYYY-MM-DD')}.pdf`;
    
    doc.save(filename);
  }

  // Form submission handler
  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearReport();
    showError("");

    // Validate date range
    if (startDateInput.value > endDateInput.value) {
      showError("Start Date cannot be after End Date.");
      return;
    }

    // Gather filters
    const filters = {
      courseModule: courseModuleSelect.value,
      year: yearSelect.value,
      semester: semesterSelect.value,
      faculty: facultySelect.value,
      department: departmentSelect.value,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      studentId: enableStudentSearchCheckbox.checked ? studentIdInput.value.trim() : null,
    };

    // Store current filters
    currentFilters = filters;

    // If student search enabled, studentId must be filled
    if (enableStudentSearchCheckbox.checked && !filters.studentId) {
      showError("Please enter a Student ID to search.");
      return;
    }

    loading(true);
    try {
      const reportData = await fetchAttendanceReport(filters);
      currentReportData = reportData;
      renderReportTable(reportData);
      renderPieChart(reportData);
      downloadPDFBtn.style.display = reportData.length ? "inline-block" : "none";
    } catch (err) {
      showError(err.message || "Failed to fetch attendance data. Please try again.");
    }
    loading(false);
  });

  // PDF download handler
  downloadPDFBtn.addEventListener("click", () => {
    if (currentReportData.length) {
      generatePDF(currentReportData, currentFilters);
    }
  });

  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();
    loadStudentIds();
  });

})();
*/