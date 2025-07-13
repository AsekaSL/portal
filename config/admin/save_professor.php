<?php
include "../dbConnection.php";

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo "No data received.";
    exit;
}

$id = $data["lecture_id"];

if ($id) {
    // Update existing
    $stmt = $connection->prepare("UPDATE lecturer SET full_name=?, password=?, nic=?, regi_num=?, year=?, contact_num=?, address=?, email=?, lecture_dep_id=? WHERE lecture_id=?");
    $stmt->bind_param("sssssssssi", $data["full_name"], $data["password"], $data["nic"], $data["regi_num"], $data["year"], $data["contact_num"], $data["address"], $data["email"], $data["lecture_dep_id"], $id);
} else {
    // Insert new
    $stmt = $connection->prepare("INSERT INTO lecturer (full_name, password, nic, regi_num, year, contact_num, address, email, lecture_dep_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $data["full_name"], $data["password"], $data["nic"], $data["regi_num"], $data["year"], $data["contact_num"], $data["address"], $data["email"], $data["lecture_dep_id"]);
}

$stmt->execute();
echo $id ? "Updated successfully." : "Added successfully.";
?>
