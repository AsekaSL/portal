<?php

    include("../dbConnection.php");
    if ($connection->connect_error) die("Connection failed");

    $result = $connection->query("SELECT index_num, full_name, year, name, regi_num   FROM student INNER JOIN department ON student.dep_id = department.dep_id");
    
    
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