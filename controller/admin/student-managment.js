const menu = document.querySelector(".hum-menu");
const menuItem = document.querySelector(".menu-item");
const menuButton = document.querySelector(".menu-item");

menu.addEventListener("click", () => {
    menuItem.classList.add("dropdown");
});

menuButton.addEventListener("click", () => {
    menuItem.classList.remove("dropdown");
});

 document.getElementById("userForm").onsubmit = async function(e) {
        e.preventDefault();

        const formData = new FormData(this);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        await fetch("http://localhost/portal/config/admin/insertStudent.php", {
            method: "POST",
            body: formData
        }).then(res => res.json())
          .then(data => {

              if(data.success) {
                alert(data.message);
                loadTable();
                document.getElementById("userForm").reset();
              }
              //loadTable(); // reload table
          })
          .catch(error => {
            console.log(error);
          })
};

window.onload = function() {
    onLoad();
    loadTable();
};

async function onLoad() {

        await fetch("http://localhost/portal/config/admin/onLoad.php", {
            method: "GET"
        }).then(res => res.json())
          .then(data => {
              if(data.success) {
                document.getElementById("department").innerHTML = convertDepartmentIntoOption(data.department);
                
              }
          })
          .catch(error => {
            console.log(error);
          })
}

const convertDepartmentIntoOption = (array) => {
    let html = `<option>Select</option>`;
    array.forEach(element => {
      html += `<option value="${element.dep_id}"> ${element.description}</option>`;
    });
    return html;
};

async function loadTable() {
  await fetch("http://localhost/portal/config/admin/selectStudent.php", {
    method: "GET"
  }).then(res => res.json())
    .then(data => {
      
      document.getElementById('student-table').innerHTML = convertStudentIntoTable(data.student);

    })
    .catch(error => {
      console.log(error);
    })
};

const convertStudentIntoTable = (array) => {
  let html = `<tr>
                <th>Index Number</th>
                <th>Name</th>
                <th>Year</th>
                <th>Department</th>
                <th>Registration Number</th>
              </tr>`;

  if ( array.length > 0) {
    array.forEach(element => {
      html += `<tr>
                    <td>${element.index_num}</td>
                    <td>${element.full_name}</td>
                    <td>${element.year}</td>
                    <td>${element.name}</td>
                    <td>${element.regi_num}</td>
                </tr>`;
    });
  }

  return html;
  
};

const serachStudent = async () => {

  const formData = new FormData();
  formData.append("indexNum", document.getElementById("index_num").value);

  await fetch("http://localhost/portal/config/admin/searchStudent.php", {
    method: "POST",
    body: formData
  }).then(res => res.json())
  .then(data => {
        loadToInput(data.student[0]);
    })
  .catch(error => {
      alert("Invalid Id");
  })
}


const loadToInput = (formData) => {
  const form = document.getElementById("userForm");
  
  Object.keys(formData).forEach(key => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) field.value = formData[key];
  });
}

const upadateStudent = async () => {

      const form = document.getElementById("userForm");


        const formData = new FormData(form);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        await fetch("http://localhost/portal/config/admin/upadateStudent.php", {
            method: "POST",
            body: formData
        }).then(res => res.json())
          .then(data => {

              if(data.success) {
                alert(data.message);
                loadTable();
              }
          })
          .catch(error => {
            alert(error.message);
          })
}


const deleteStudent = async () => {
  const form = document.getElementById("userForm");


  const formData = new FormData(form);

  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  await fetch("http://localhost/portal/config/admin/deleteStudent.php", {
    method: "POST",
    body: formData
  }).then(res => res.json())
    .then(data => {
      if(data.success) {
        alert(data.message);
        document.getElementById("userForm").reset();
        loadTable();
      }
    })
    .catch(error => {
      alert(error.message);
    })
};