<?php
    include("../dbConnection.php");

    if ($connection->connect_error) die("Connection failed");

    $lectureId = $_POST["lectureId"];
    

    $result = $connection->query("SELECT status FROM qrcode WHERE lecturer_id = '$lectureId'");
    
    $status = [];

    while ($row = $result->fetch_assoc()) {
        $status[] = $row;
    }

    
    
    if (count($status) > 0) {
        echo json_encode(["success" => true, "status" => $status]);
    }else {
        echo json_encode(["success" => false, "message" => "Empty data table"]);
    }

?>