<div class="course-container">
  <div class="main-content">
    <div class="main-box">
      <div class="info-box">
        <input type="text" class="input" placeholder="Course Code" id="courseCode">
        <input type="text" class="input" placeholder="Course Description" id="courseDesc">
        <input type="text" class="input" placeholder="Department" id="department">
        <input type="text" class="input" placeholder="Semester" id="semester">
        <input type="text" class="input" placeholder="Status" id="status">
        <input type="text" class="input" placeholder="Assigned Professor" id="professor">
        <input type="text" class="input" placeholder="Course Name" id="courseName">
      </div>

      <div class="info-box">
        <input type="text" class="input" placeholder="Faculty" id="faculty">
        <input type="text" class="input" placeholder="Credits" id="credits">
        <input type="text" class="input" placeholder="Year Offered" id="year">
        <input type="text" class="input" placeholder="Prerequisites" id="prerequisites">
        <label for="schedule">Course Schedule (Starting date)</label>
        <input type="date" class="input" id="schedule">

        <div class="button-box">
          <button onclick="addCourse()">Add</button>
          <button>Update</button>
          <button>Delete</button>
        </div>
      </div>
    </div>

    <div class="search-box-row">
      <div class="search-box">
        <input type="text" placeholder="Enter Student Name" class="search">
        <div class="search-icon"></div>
      </div>
    </div>

    <div class="table">
      <table>
        <tr>
          <th>ID</th>
          <th>Course Code</th>
          <th>Course Name</th>
          <th>test column</th>
          <th>test column</th>
          <th>Professor</th>
        </tr>
        <tr><td colspan="6">Sample data</td></tr>
        <tr><td colspan="6">Sample data</td></tr>
      </table>
    </div>
  </div>
</div>
