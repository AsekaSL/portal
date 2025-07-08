<?php
  include("../dbConnection.php");

  if ($connection->connect_error) die("Connection failed");

  $lectureId = $_POST["lectureId"];

  $sql = "UPDATE qrcode SET status = false WHERE lecturer_id = '$lectureId'";

  if ($connection->query($sql) === TRUE) {
      echo json_encode(["success" => true, "message" => "Successfully Change Status"]);
  } else {
      echo json_encode(["success" => false, "message" => $conn->error]);
  }

?>