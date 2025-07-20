const subjectOptions = {
    CS: ["Data Communication & Networks", "Operating Systems", "Statistical Distribution and Inferences", "Artificial Intelligence", "Web Technologies", "Group Project", "Mathematics for Computing"],
    SE: ["Essentials of Computer Law", "Software Design and Architecture", "Formal Methods in software Development", "Essentials in Computer Networking", "Artificial Intelligence", "Web Technologies", "Group Project", "Mathematics for Computing"],
    IS: ["Statistical Distribution and Inferences", "Operations Management", "Information Systems Security", "Marketing Management", "System Administration and Maintenance", "Business Process Management", "Organizational Behaviour and Society"]
}
function updateSubjects() {
    const departmentSelect = document.getElementById("department");
    const subjectSelect = document.getElementById("subject");

    const selectedDepartment = departmentSelect.value;
    subjectSelect.innerHTML = '<option value="">Select</option>';

    if (subjectOptions[selectedDepartment]) {
        subjectOptions[selectedDepartment].forEach(subject => {
            const option = document.createElement("option");
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }
}