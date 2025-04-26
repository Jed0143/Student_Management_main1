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

// Debugging: log raw input (optional - for testing)
file_put_contents("debug_post.txt", print_r($_POST, true));
file_put_contents("debug_files.txt", print_r($_FILES, true));

// Check slot limit
$limit = 20;
$checkQuery = $conn->query("SELECT COUNT(*) as total FROM pre_enrollment");
$countRow = $checkQuery->fetch_assoc();

if ($countRow['total'] >= $limit) {
    echo json_encode(["status" => "error", "message" => "Pre-enrollment slots are full."]);
    exit;
}

// Collect inputs
$requiredFields = [
    'childName', 'Gender', 'birthday', 'age', 'address',
    'firstLanguage', 'secondLanguage', 'guardian', 'guardianContact', 'guardianRelationship',
    'motherName', 'motherAddress', 'motherWork', 'motherContact',
    'fatherName', 'fatherAddress', 'fatherWork', 'fatherContact',
    'emergencyName', 'emergencyContact', 'email', 'password', 'confirmPassword'
];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(["status" => "error", "message" => "Missing required field: $field"]);
        exit;
    }
}

// Assign variables
$childName = $_POST['childName'];
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
$email = $_POST['email'];
$password = $_POST['password'];
$confirmPassword = $_POST['confirmPassword'];
$date = $_POST['date'] ?? date('Y-m-d');

// Validate passwords match
if ($password !== $confirmPassword) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into pre_enrollment table
$sql = "INSERT INTO pre_enrollment (
    child_name, Gender, birthday, age, address,
    first_language, second_language, guardian, guardian_contact, guardian_relationship,
    mother_name, mother_address, mother_work, mother_contact,
    father_name, father_address, father_work, father_contact,
    emergency_name, emergency_contact, date, email, password
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssssssssssssssssssssss",
    $childName, $Gender, $birthday, $age, $address,
    $firstLanguage, $secondLanguage, $guardian, $guardianContact, $guardianRelationship,
    $motherName, $motherAddress, $motherWork, $motherContact,
    $fatherName, $fatherAddress, $fatherWork, $fatherContact,
    $emergencyName, $emergencyContact, $date, $email, $password // Store unhashed in pre_enrollment
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
