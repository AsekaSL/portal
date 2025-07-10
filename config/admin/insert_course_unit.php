<?php
include "../dbConnection.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo "No data received.";
    exit;
}

$lecturerName = $data->professor;
$lecturerId = null;

$getLecturerId = $connection->prepare("SELECT id FROM professor WHERE name = ?");
$getLecturerId->bind_param("s", $lecturerName);
$getLecturerId->execute();
$getLecturerId->bind_result($lecturerId);
$getLecturerId->fetch();
$getLecturerId->close();

if (!$lecturerId) {
    echo "Error: Lecturer not found.";
    exit;
}

$sql = "INSERT INTO course (course_code, name, description, dep_id, semester, status, lecture_dep_id, faculty, credits, year_offered, prerequisites, course_schedule)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $connection->prepare($sql);
$stmt->bind_param("ssssssssssss",
    $data->courseCode,
    $data->courseName,
    $data->courseDesc,
    $data->department,
    $data->semester,
    $data->status,
    $lecturerId,
    $data->faculty,
    $data->credits,
    $data->year,
    $data->prerequisites,
    $data->schedule
);

if ($stmt->execute()) {
    echo "Course unit added successfully.";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$connection->close();
?>
