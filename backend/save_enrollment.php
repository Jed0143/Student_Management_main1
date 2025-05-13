<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// DB connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_management";
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

// Debugging: output POST data to check if full_name is being sent
file_put_contents('php://stderr', print_r($_POST, true));  // This will output data to error log

// Ensure required fields are set
$requiredFields = [
    'full_name', 'email', 'gender', 'birthday', 'age', 'address',
    'firstLanguage', 'secondLanguage', 'guardian', 'guardianContact', 'guardianRelationship',
    'motherName', 'motherAddress', 'motherWork', 'motherContact',
    'fatherName', 'fatherAddress', 'fatherWork', 'fatherContact',
    'emergencyName', 'emergencyContact'
];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(["status" => "error", "message" => "Missing required field: $field"]);
        exit;
    }
}

// Assign variables
$full_name = $_POST['full_name'];  // Match with your table column name 'full_name'
$email = $_POST['email'];
$gender = $_POST['gender'];
$birthday = $_POST['birthday'];
$age = $_POST['age'];
$address = $_POST['address'];
$firstLanguage = $_POST['firstLanguage'];
$secondLanguage = $_POST['secondLanguage'];
$guardian = $_POST['guardian'];
$guardianContact = $_POST['guardianContact'];
$guardianRelationship = $_POST['guardianRelationship'];
$motherName = $_POST['motherName'];
$motherAddress = $_POST['motherAddress'];
$motherWork = $_POST['motherWork'];
$motherContact = $_POST['motherContact'];
$fatherName = $_POST['fatherName'];
$fatherAddress = $_POST['fatherAddress'];
$fatherWork = $_POST['fatherWork'];
$fatherContact = $_POST['fatherContact'];
$emergencyName = $_POST['emergencyName'];
$emergencyContact = $_POST['emergencyContact'];
$date = $_POST['date'] ?? date('Y-m-d');

// Insert into pre_enrollment table without schedule
$sql = "INSERT INTO pre_enrollment (
    full_name, email, gender, birthday, age, address,
    first_language, second_language, guardian, guardian_contact, guardian_relationship,
    mother_name, mother_address, mother_work, mother_contact,
    father_name, father_address, father_work, father_contact,
    emergency_name, emergency_contact, date
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)" ;

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

// Bind parameters correctly (correct data types: s for string, i for integer)
$stmt->bind_param("ssssssssssssssssssssss", 
    $full_name, $email, $gender, $birthday, $age, $address,
    $firstLanguage, $secondLanguage, $guardian, $guardianContact, $guardianRelationship,
    $motherName, $motherAddress, $motherWork, $motherContact,
    $fatherName, $fatherAddress, $fatherWork, $fatherContact,
    $emergencyName, $emergencyContact, $date
);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Enrollment successful"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
