<?php
  include("../dbConnection.php");

  if ($connection->connect_error) die("Connection failed");

  $lectureId = $_POST["lectureId"];
  $title = $_POST["title"];


  $sql = "INSERT INTO qrcode VALUES ('$lectureId', '$title', true)";

  if ($connection->query($sql) === TRUE) {
      echo json_encode(["success" => true, "message" => "Successfully added"]);
  } else {
      echo json_encode(["success" => false, "message" => $conn->error]);
  }

?>