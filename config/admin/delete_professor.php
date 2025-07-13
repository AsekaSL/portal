<?php
include "../dbConnection.php";

$id = $_GET["id"];
if (!$id) {
    echo "Invalid ID";
    exit;
}

$stmt = $connection->prepare("DELETE FROM lecturer WHERE lecture_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo "Deleted successfully.";
?>
