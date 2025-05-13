<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$username = "root";
$password = "";
$database = "student_management"; // Use your database name

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$full_name = $data['full_name'];
$gender = $data['gender'];
$birthday = $data['birthday'];
$age = $data['age'];
$date = $data['date'];
$address = $data['address'];
$first_language = $data['first_language'];
$second_language = $data['second_language'];
$email = $data['email'];

$mother_name = $data['mother_name'];
$mother_work = $data['mother_work'];
$mother_contact = $data['mother_contact'];

$fathers_name = $data['father_name'];
$father_work = $data['father_work'];
$father_contact = $data['father_contact'];

$guardian = $data['guardian'];
$guardian_contact = $data['guardian_contact'];
$guardian_relationship = $data['guardian_relationship'];

$emergency_name = $data['emergency_name'];
$emergency_contact = $data['emergency_contact'];

$sql = "UPDATE pre_enrollment SET 
  full_name = ?,
  gender = ?,
  birthday = ?,
  age = ?,
  date = ?,
  address = ?,
  first_language = ?,
  second_language = ?,
  email = ?,
  mother_name = ?,
  mother_work = ?,
  mother_contact = ?,
  father_name = ?,
  father_work = ?,
  father_contact = ?,
  guardian = ?,
  guardian_contact = ?,
  guardian_relationship = ?,
  emergency_name = ?,
  emergency_contact = ?
WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
  "sssssssssssssssssssss i",
  $full_name,
  $gender,
  $birthday,
  $age,
  $date,
  $address,
  $first_language,
  $second_language,
  $email,
  $mother_name,
  $mother_work,
  $mother_contact,
  $father_name,
  $father_work,
  $father_contact,
  $guardian,
  $guardian_contact,
  $guardian_relationship,
  $emergency_name,
  $emergency_contact,
  $id
);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Student profile updated successfully."]);
} else {
  echo json_encode(["success" => false, "message" => "Error updating student profile: " . $stmt->error]);
}

$stmt->close();
$conn->close();
