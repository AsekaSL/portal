<?php

    include("../dbConnection.php");
    if ($connection->connect_error) die("Connection failed");

    $index = $_POST["indexNum"];
    
    $result = $connection->query("SELECT * FROM student WHERE index_num = '$index'");
    
    $student = [];

    while ($row = $result->fetch_assoc()) {
        $student[] = $row;
    }
    
    if (count($student) > 0) {
        echo json_encode(["success" => true, "student" => $student]);
    }else {
        echo json_encode(["success" => false, "message" => "Empty data table"]);
    }
?>