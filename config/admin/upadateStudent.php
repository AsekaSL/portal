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


  $sql = "UPDATE student SET full_name = '$fullName', regi_num = '$regiNumber', year = '$year', contact_num = '$contactNumber', address = '$address', email = '$email' ,dep_id = '$department' WHERE index_num = '$index'";

  if ($connection->query($sql) === TRUE) {
      echo json_encode(["success" => true, "message" => "Successfully updated"]);
  } else {
      echo "Error: " . $conn->error;
  }

?>