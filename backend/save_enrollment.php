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

// Get all inputs
$childName = $_POST['childName'] ?? '';
$Gender = $_POST['Gender'] ?? '';
$birthday = $_POST['birthday'] ?? '';
$age = $_POST['age'] ?? '';
$firstLanguage = $_POST['firstLanguage'] ?? '';
$secondLanguage = $_POST['secondLanguage'] ?? '';
$guardian = $_POST['guardian'] ?? '';
$guardianContact = $_POST['guardianContact'] ?? '';
$guardianRelationship = $_POST['guardianRelationship'] ?? '';
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
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$date = $_POST['date'] ?? date('Y-m-d');
$address = $_POST['address'] ?? '';

// Validate passwords match
if ($password !== $confirmPassword) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into pre_enrollment
$sql = "INSERT INTO pre_enrollment
(child_name, Gender, birthday, age, address, first_language, second_language, guardian, guardian_contact, guardian_relationship,
mother_name, mother_address, mother_work, mother_contact, father_name, father_address, father_work, father_contact, 
emergency_name, emergency_contact, date, email, password, confirm_password)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssssssssssssssssssssssss", 
    $childName, $Gender, $birthday, $age, $address, $firstLanguage, $secondLanguage, $guardian, $guardianContact, $guardianRelationship,
    $motherName, $motherAddress, $motherWork, $motherContact, $fatherName, $fatherAddress, $fatherWork, $fatherContact, 
    $emergencyName, $emergencyContact, $date, $email, $password, $confirmPassword
);

if ($stmt->execute()) {
    // Insert into users table
    $checkUser = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkUser->bind_param("s", $email);
    $checkUser->execute();
    $result = $checkUser->get_result();

    if ($result->num_rows === 0) {
        $insertUser = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'parent')");
        $insertUser->bind_param("ss", $email, $hashedPassword);
        $insertUser->execute();
        $insertUser->close();
    }

    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Enrollment and user creation successful"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
