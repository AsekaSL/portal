<?php

    include("../dbConnection.php");
    if ($connection->connect_error) die("Connection failed");

    $result = $connection->query("SELECT dep_id, description  FROM department");
    
    
    $department = [];

    while ($row = $result->fetch_assoc()) {
        $department[] = $row;
    }
    
    if (count($department) > 0) {
        echo json_encode(["success" => true, "department" => $department]);
    }else {
        echo json_encode(["success" => false, "message" => "Empty data table"]);
    }
    

    
?>