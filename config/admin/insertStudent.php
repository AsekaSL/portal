<?php
  include("../dbConnection.php");

  if ($connection->connect_error) die("Connection failed");

  

  $fullName = $_POST["full_name"];
  $index = $_POST["index_num"];
  $year = $_POST["year"];
  $department = $_POST["dep_id"];
  $regiNumber = $_POST["regi_num"];
  $contactNumber = $_POST["contact_num"];
  $email = $_POST["email"];
  $address = $_POST["address"];


  $sql = "INSERT INTO student (index_num, full_name, password, regi_num, year, contact_num, address, email ,dep_id) VALUES ('$index', '$fullName', 'abc123', '$regiNumber', '$year', '$contactNumber', '$address','$email' ,'$department')";

  if ($connection->query($sql) === TRUE) {
      echo json_encode(["success" => true, "message" => "Successfully added"]);
  } else {
      echo "Error: " . $conn->error;
  }

?>