<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input or missing student ID."]);
    exit();
}

require_once("db_connection.php");

$id = $conn->real_escape_string($input['id']);

// Define all fields (sanitize inputs)
$full_name = $conn->real_escape_string($input['full_name'] ?? '');
$gender = $conn->real_escape_string($input['gender'] ?? '');
$birthday = $conn->real_escape_string($input['birthday'] ?? '');
$age = (int)($input['age'] ?? 0);
$date = $conn->real_escape_string($input['date'] ?? '');
$address = $conn->real_escape_string($input['address'] ?? '');
$first_language = $conn->real_escape_string($input['first_language'] ?? '');
$second_language = $conn->real_escape_string($input['second_language'] ?? '');
$guardian = $conn->real_escape_string($input['guardian'] ?? '');
$guardian_contact = $conn->real_escape_string($input['guardian_contact'] ?? '');
$guardian_relationship = $conn->real_escape_string($input['guardian_relationship'] ?? '');
$mother_name = $conn->real_escape_string($input['mother_name'] ?? '');
$mother_address = $conn->real_escape_string($input['mother_address'] ?? '');
$mother_work = $conn->real_escape_string($input['mother_work'] ?? '');
$mother_contact = $conn->real_escape_string($input['mother_contact'] ?? '');
$father_name = $conn->real_escape_string($input['father_name'] ?? '');
$father_address = $conn->real_escape_string($input['father_address'] ?? '');
$father_work = $conn->real_escape_string($input['father_work'] ?? '');
$father_contact = $conn->real_escape_string($input['father_contact'] ?? '');
$emergency_name = $conn->real_escape_string($input['emergency_name'] ?? '');
$emergency_contact = $conn->real_escape_string($input['emergency_contact'] ?? '');
$email = $conn->real_escape_string($input['email'] ?? '');

// Update query
$sql = "UPDATE pre_enrollment SET 
    full_name='$full_name',
    gender='$gender',
    birthday='$birthday',
    age=$age,
    date='$date',
    address='$address',
    first_language='$first_language',
    second_language='$second_language',
    guardian='$guardian',
    guardian_contact='$guardian_contact',
    guardian_relationship='$guardian_relationship',
    mother_name='$mother_name',
    mother_address='$mother_address',
    mother_work='$mother_work',
    mother_contact='$mother_contact',
    father_name='$father_name',
    father_address='$father_address',
    father_work='$father_work',
    father_contact='$father_contact',
    emergency_name='$emergency_name',
    emergency_contact='$emergency_contact',
    email='$email'
    WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    // Return updated record
    $result = $conn->query("SELECT * FROM pre_enrollment WHERE id='$id'");
    $updated = $result->fetch_assoc();
    echo json_encode($updated);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update student: " . $conn->error]);
}

$conn->close();
?>
