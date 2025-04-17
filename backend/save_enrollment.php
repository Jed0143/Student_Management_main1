<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mpcar";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Connection failed"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$limit = 20;
$checkQuery = $conn->query("SELECT COUNT(*) as total FROM pre_enrollment");
$countRow = $checkQuery->fetch_assoc();

if ($countRow['total'] >= $limit) {
    echo json_encode(["status" => "error", "message" => "Pre-enrollment slots are full."]);
    exit;
}

$childName = $_POST['childName'] ?? '';
$Gender = $_POST['Gender'] ?? '';
$birthday = $_POST['birthday'] ?? '';
$age = $_POST['age'] ?? '';
$firstLanguage = $_POST['firstLanguage'] ?? '';
$secondLanguage = $_POST['secondLanguage'] ?? '';
$guardian = $_POST['guardian'] ?? '';
$guardianContact = $_POST['guardianContact'] ?? '';
$motherName = $_POST['motherName'] ?? '';
$motherAddress = $_POST['motherAddress'] ?? '';
$motherWork = $_POST['motherWork'] ?? '';
$motherContact = $_POST['motherContact'] ?? '';
$fatherName = $_POST['fatherName'] ?? '';
$fatherAddress = $_POST['fatherAddress'] ?? '';
$fatherWork = $_POST['fatherWork'] ?? '';
$fatherContact = $_POST['fatherContact'] ?? '';
$emergencyName = $_POST['emergencyName'] ?? '';
$emergencyContact = $_POST['emergencyContact'] ?? '';
$email = $_POST['email'] ?? '';
$date = $_POST['date'] ?? date('Y-m-d');
$address = $_POST['address'] ?? '';

$sql = "INSERT INTO pre_enrollment
(child_name, Gender, birthday, age, address, first_language, second_language, guardian, guardian_contact, 
mother_name, mother_address, mother_work, mother_contact, father_name, father_address, father_work, father_contact, 
emergency_name, emergency_contact, date, email)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssssssssssssssssssss", 
    $childName, $Gender, $birthday, $age, $address, $firstLanguage, $secondLanguage, $guardian, $guardianContact, 
    $motherName, $motherAddress, $motherWork, $motherContact, $fatherName, $fatherAddress, $fatherWork, $fatherContact, 
    $emergencyName, $emergencyContact, $date, $email
);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Enrollment saved successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>