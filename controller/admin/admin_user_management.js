document.getElementById("professorForm").onsubmit = async function (e) {
  e.preventDefault();

  const formData = {
    lecture_id: document.getElementById("lecture_id").value,
    full_name: document.getElementById("full_name").value,
    password: document.getElementById("password").value,
    nic: document.getElementById("nic").value,
    regi_num: document.getElementById("regi_num").value,
    year: document.getElementById("year").value,
    contact_num: document.getElementById("contact_num").value,
    address: document.getElementById("address").value,
    email: document.getElementById("email").value,
    lecture_dep_id: document.getElementById("lecture_dep_id").value
  };

  const res = await fetch("../../config/admin/save_professor.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  alert(await res.text());
  loadProfessors();
  this.reset();
};

document.getElementById("searchBox").oninput = loadProfessors;
window.onload = loadProfessors;

async function loadProfessors() {
  const keyword = document.getElementById("searchBox").value;
  const res = await fetch("../../config/admin/search_professors.php?q=" + keyword);
  const data = await res.json();

  const container = document.getElementById("professorList");
  container.innerHTML = "";

  data.forEach(prof => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <b>${prof.full_name}</b> (${prof.lecture_id})<br>Email: ${prof.email}<br>NIC: ${prof.nic}<br>
      <button onclick='editProfessor(${JSON.stringify(prof)})'>Edit</button>
      <button onclick='deleteProfessor(${prof.lecture_id})'>Delete</button>
    `;
    container.appendChild(div);
  });
}

function editProfessor(prof) {
  for (const key in prof) {
    if (document.getElementById(key)) {
      document.getElementById(key).value = prof[key];
    }
  }
}

async function deleteProfessor(id) {
  if (!confirm("Are you sure you want to delete this professor?")) return;
  const res = await fetch("../../config/admin/delete_professor.php?id=" + id);
  alert(await res.text());
  loadProfessors();
}

function loadDepartments() {
  fetch("../../config/admin/get_departments.php")
    .then(res => res.json())
    .then(data => {
      const dropdown = document.getElementById("lecture_dep_id");
      data.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep.lecture_id;
        option.textContent = dep.name;
        dropdown.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading departments:", err));
}

document.addEventListener("DOMContentLoaded", loadDepartments);
