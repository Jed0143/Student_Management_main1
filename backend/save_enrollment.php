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

// Ensure required fields are set
$requiredFields = [
    'name', 'Gender', 'birthday', 'age', 'address',
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
$name = $_POST['name'];
$Gender = $_POST['Gender'];
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


// Hash password for storage in the users table
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into pre_enrollment table
$sql = "INSERT INTO pre_enrollment (
    name, Gender, birthday, age, address,
    first_language, second_language, guardian, guardian_contact, guardian_relationship,
    mother_name, mother_address, mother_work, mother_contact,
    father_name, father_address, father_work, father_contact,
    emergency_name, emergency_contact, date
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

// Bind parameters correctly (correct data types: s for string, i for integer)
$stmt->bind_param("sssssssssssssssssssss", 
    $name, $Gender, $birthday, $age, $address,
    $firstLanguage, $secondLanguage, $guardian, $guardianContact, $guardianRelationship,
    $motherName, $motherAddress, $motherWork, $motherContact,
    $fatherName, $fatherAddress, $fatherWork, $fatherContact,
    $emergencyName, $emergencyContact, $date
);

if ($stmt->execute()) {
    // Also insert into users table if email not taken
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
