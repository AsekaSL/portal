<?php
include "../dbConnection.php";

$result = $connection->query("SELECT lecture_id, name FROM lecture_department");
$departments = [];

while ($row = $result->fetch_assoc()) {
    $departments[] = $row;
}

header("Content-Type: application/json");
echo json_encode($departments);
?>
