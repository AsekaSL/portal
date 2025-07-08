document.getElementById("generateButton").addEventListener("click", async () => {
    const title = document.getElementById('lecture-title').value;
    const time = document.getElementById('time').value;
    const date = document.getElementById('date').value;
    const course = document.getElementById('course').value;
    const lecturerId = "L001";

    await addSession(lecturerId, title);

    document.querySelector(".session-box").innerHTML = genrateHtml(title, time, date, course);

    const qrData = `http://localhost/portal/pages/qr-code-scanning/loading.html?lecture_id=${lecturerId}&title=${title}&time=${time}&date=${date}&course=${course}`;
    const qrContainer = document.getElementById("qrcode");

    // Clear existing QR if needed
    qrContainer.innerHTML = ``;

    new QRCode(qrContainer, {
        text: qrData,
        width: 128,
        height: 128
    });

    document.getElementById("closeGenerateButton").addEventListener("click", () => {
        loadHtml();
        closeSession(lecturerId);
    })

});

const loadHtml = () => {
    document.querySelector(".session-box").innerHTML = ` <div class="session-card">
                    <div class="session-title">Create New Attendance Session</div>
                <div>
                    <div class="session-text-container">Course Name</div>
                    <select name="" id="" class="session-input-caontiner">
                        <option value="">Select Course</option>
                        <option value="Web Teachonology">Web Teachonology</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                    </select>
                </div>
                <div class="title-time-container">
                    <div>
                        <div class="session-text-container">Lecture Title</div>
                        <input class="session-input-caontiner" type="text" name="lecture-title" placeholder="Enter Lecture title" required>
                    </div>
                    <div>
                        <div class="session-text-container">QR Valid Time</div>
                        <input class="session-input-caontiner" type="time" name="lecture-time" required>
                    </div>
                </div>
                <div>
                    <div class="session-text-container">Date</div>
                    <input type="date" name="lecture-date" class="session-input-caontiner" placeholder="Enter Date" required>
                </div>
                <button class="generate-button" id="generateButton">
                    Generate QR Code
                </button>
                
                </div>`;
}

const genrateHtml = (title, time, date, course) => {
    return `<div class="generate-card">
                <div class="generate-title">
                    Scan QR code to Mark Attendance
                </div>
                <div id="qrcode" class="qr-code-container">
                    <!-- <img src="../../assets/qr-code/qr-code.png" alt=""> -->
                </div>
                <div class="session-details">
                    <table class="session-details-tables">
                        <tr>
                            <td class="title-tr">
                                Course Name
                            </td>
                            <td>
                                ${course}
                            </td>
                        </tr>
                        <tr>
                            <td class="title-tr">
                                Lecture Title 
                            </td>
                            <td>
                                ${title}
                            </td>
                        </tr>
                        <tr>
                            <td  class="title-tr">
                                Date
                            </td>
                            <td>
                                ${time}
                            </td>
                        </tr>
                    </table>
                </div>
                <button id="closeGenerateButton" class="generate-button">
                    Close QR Code
                </button>
            </div>`;
};

const addSession = async (lecture_id, title) => {

  const formData = new FormData();
  formData.append("lectureId", lecture_id);
  formData.append("title", title);

  await fetch("http://localhost/portal/config/qr-code/inertStatus.php", {
    method: "POST",
    body: formData
  }).then(res => res.json())
  .then(data => {
        console.log(data);
    })
  .catch(error => {
      console.log(error);
  })
};

const closeSession = async (lecture_id) => {
    const formData = new FormData();
    formData.append("lectureId", lecture_id);
    

    await fetch("http://localhost/portal/config/qr-code/closeSession.php", {
        method: "POST",
        body: formData
    }).then(res => res.json())
    .then(data => {
            console.log(data);
        })
    .catch(error => {
        console.log(error);
    })

}