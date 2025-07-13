<?php
include "../dbConnection.php";

$q = $_GET["q"] ?? "";

$stmt = $connection->prepare("SELECT * FROM lecturer WHERE full_name LIKE ? OR lecture_id LIKE ?");
$search = "%$q%";
$stmt->bind_param("ss", $search, $search);
$stmt->execute();

$result = $stmt->get_result();
$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

header("Content-Type: application/json");
echo json_encode($rows);
?>
