<div class="report-gen">
  <div class="report-container">
    <form id="reportForm" autocomplete="off" spellcheck="false">
      <div>
        <label for="courseModule">Course Module</label>
        <select id="courseModule" name="courseModule" required>
          <option value="">Select Module</option>
        </select>
      </div>

      <div>
        <label for="year">Year</label>
        <select id="year" name="year" required>
          <option value="">Select Year</option>
        </select>
      </div>

      <div>
        <label for="semester">Semester</label>
        <select id="semester" name="semester" required>
          <option value="">Select Semester</option>
        </select>
      </div>

      <div>
        <label for="faculty">Faculty</label>
        <select id="faculty" name="faculty" required>
          <option value="">Select Faculty</option>
        </select>
      </div>

      <div>
        <label for="department">Department</label>
        <select id="department" name="department" required>
          <option value="">Select Department</option>
        </select>
      </div>

      <div>
        <label for="startDate">Start Date</label>
        <input type="date" id="startDate" name="startDate" required />
      </div>

      <div>
        <label for="endDate">End Date</label>
        <input type="date" id="endDate" name="endDate" required />
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="enableStudentSearch" name="enableStudentSearch" />
        <label for="enableStudentSearch">Enable Search by Student</label>
      </div>

      <div class="student-search-wrapper">
        <label for="studentId">Student ID</label>
        <input type="text" id="studentId" name="studentId" placeholder="Enter Student ID" disabled list="studentIds" />
        <datalist id="studentIds"></datalist>
        <span id="searchIcon" class="search-icon" title="Search Student">&#128269;</span>
      </div>

      <button type="submit" id="generateReport">Generate Report</button>
    </form>

    <div id="loading" style="display:none;">Loading...</div>
    <div id="error" style="display:none;"></div>

    <table id="reportTable" style="display:none;">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Attendance %</th>
          <th>Present Days</th>
          <th>Absent Days</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>

    <div id="chartContainer" style="display:none;">
      <canvas id="attendancePieChart"></canvas>
    </div>

    <button id="downloadPDF">Download PDF Report</button>
  </div>
</div>

<!-- <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin - Attendance Report</title>


  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>

  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div class="container">
    <h1>Attendance Report Generation</h1>
    <form id="reportForm" autocomplete="off" spellcheck="false">
      <div>
        <label for="courseModule">Course Module</label>
        <select id="courseModule" name="courseModule" required>
          <option value="">Select Module</option>
        </select>
      </div>

      <div>
        <label for="year">Year</label>
        <select id="year" name="year" required>
          <option value="">Select Year</option>
        </select>
      </div>

      <div>
        <label for="semester">Semester</label>
        <select id="semester" name="semester" required>
          <option value="">Select Semester</option>
        </select>
      </div>

      <div>
        <label for="faculty">Faculty</label>
        <select id="faculty" name="faculty" required>
          <option value="">Select Faculty</option>
        </select>
      </div>

      <div>
        <label for="department">Department</label>
        <select id="department" name="department" required>
          <option value="">Select Department</option>
        </select>
      </div>

      <div>
        <label for="startDate">Start Date</label>
        <input type="date" id="startDate" name="startDate" required />
      </div>

      <div>
        <label for="endDate">End Date</label>
        <input type="date" id="endDate" name="endDate" required />
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="enableStudentSearch" name="enableStudentSearch" />
        <label for="enableStudentSearch">Enable Search by Student</label>
      </div>

      <div class="student-search-wrapper">
        <label for="studentId">Student ID</label>
        <input type="text" id="studentId" name="studentId" placeholder="Enter Student ID" disabled list="studentIds" />
        <datalist id="studentIds">

        </datalist>
        <span id="searchIcon" class="search-icon" title="Search Student">&#128269;</span>
      </div>

      <button type="submit" id="generateReport">Generate Report</button>
    </form>

    <div id="loading" style="display:none;">Loading...</div>
    <div id="error" style="display:none;"></div>

    <div id="reportSummary" class="report-summary">
      <h3>Report Summary</h3>
      <div class="summary-stats">
        <div class="stat-card">
          <div class="stat-number" id="totalStudents">0</div>
          <div class="stat-label">Total Students</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="avgAttendance">0%</div>
          <div class="stat-label">Average Attendance</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="totalClasses">0</div>
          <div class="stat-label">Total Classes</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="dateRange">0</div>
          <div class="stat-label">Days Range</div>
        </div>
      </div>
    </div>

    <table id="reportTable" style="display:none;">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Attendance %</th>
          <th>Present Days</th>
          <th>Absent Days</th>
          <th>Late Arrivals</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>

    <div id="chartContainer" style="display:none;">
      <canvas id="attendancePieChart"></canvas>
    </div>

    <button id="downloadPDF">Download Detailed PDF Report</button>
  </div>

  <script src="script.js"></script>
</body>

</html> -->