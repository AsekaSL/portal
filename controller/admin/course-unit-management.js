function addCourse() {
  const data = {
    courseCode: document.getElementById("courseCode").value,
    courseName: document.getElementById("courseName").value,
    courseDesc: document.getElementById("courseDesc").value,
    department: document.getElementById("department").value,
    semester: document.getElementById("semester").value,
    status: document.getElementById("status").value,
    professor: document.getElementById("professor").value,
    faculty: document.getElementById("faculty").value,
    credits: document.getElementById("credits").value,
    year: document.getElementById("year").value,
    prerequisites: document.getElementById("prerequisites").value,
    schedule: document.getElementById("schedule").value
  };

  fetch("../../config/admin/insert_course_unit.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(msg => alert(msg))
  .catch(err => alert("Error: " + err));
}
