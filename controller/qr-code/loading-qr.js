window.onload = () => {
    sendApi();
}
const sendApi = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lecture_id = urlParams.get('lecture_id');

    const formData = new FormData();
    formData.append("lectureId", lecture_id);

    await fetch("http://localhost/portal/config/qr-code/loadding.php", {
        method: "POST",
        body: formData
    }).then(res => res.json())
    .then(data => {
        if(data.status[0].status == true) {
            document.getElementById('loading-container').innerHTML = approved();
        }else {
            document.getElementById('loading-container').innerHTML = decline();
        }
    })
    .catch(error => {
        console.log(error);
    })
};


const approved = () => {
    return `<div class="approved-title">Attendence Macked Successfully!</div>
        <img src="../../assets/qr-code/approved.png" alt="Approved" class="approved-img">
        <div class="approved-info">Please wait while we process your scan.</div>`;
}

const decline = () => {
    return `<div class="decline-title">Attendance Not Approved</div>
        <img src="../../assets/qr-code/decline.png" alt="decline" class="decline-img">
        <div class="decline-info">QR code expired. Contact your lecturer.</div>`;
}