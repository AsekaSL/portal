<?php

    include("../dbConnection.php");
    if ($connection->connect_error) die("Connection failed");

    $index = $_POST["index_num"];
    
    $sql = "DELETE FROM student WHERE index_num = '$index'";
    
    if ($connection->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Successfully deleted"]);
    } else {
        echo "Error: " . $conn->error;
    }
?>