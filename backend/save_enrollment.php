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

// Required fields - including emergency name parts
$requiredFields = [
    'first_name', 'middle_name', 'last_name', 'email', 'gender', 'birthday', 'age',
    'street', 'barangay', 'city', 'province', 'postal',
    'firstLanguage', 'secondLanguage',
    'guardianFirstName', 'guardianMiddleName', 'guardianLastName', 'guardianContact', 'guardianRelationship',
    'motherFirstName', 'motherMiddleName', 'motherLastName',
    'motherStreet', 'motherBarangay', 'motherCity', 'motherProvince', 'motherZip',
    'motherWork', 'motherContact',
    'fatherFirstName', 'fatherMiddleName', 'fatherLastName',
    'fatherStreet', 'fatherBarangay', 'fatherCity', 'fatherProvince', 'fatherZip',
    'fatherWork', 'fatherContact',
    'emergencyFirstName', 'emergencyMiddleName', 'emergencyLastName', 'emergencyContact'
];

// Validate required fields
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(["status" => "error", "message" => "Missing required field: $field"]);
        exit;
    }
}

// Student Name
$first_name = trim($_POST['first_name']);
$middle_name = trim($_POST['middle_name']);
$last_name = trim($_POST['last_name']);
$full_name = $first_name . ($middle_name ? " " . $middle_name : "") . " " . $last_name;

// Guardian Name
$guardianFirstName = trim($_POST['guardianFirstName']);
$guardianMiddleName = trim($_POST['guardianMiddleName']);
$guardianLastName = trim($_POST['guardianLastName']);
$guardian = $guardianFirstName . ($guardianMiddleName ? " " . $guardianMiddleName : "") . " " . $guardianLastName;

// Mother Name
$motherFirstName = trim($_POST['motherFirstName']);
$motherMiddleName = trim($_POST['motherMiddleName']);
$motherLastName = trim($_POST['motherLastName']);
$motherName = $motherFirstName . ($motherMiddleName ? " " . $motherMiddleName : "") . " " . $motherLastName;

// Father Name
$fatherFirstName = trim($_POST['fatherFirstName']);
$fatherMiddleName = trim($_POST['fatherMiddleName']);
$fatherLastName = trim($_POST['fatherLastName']);
$fatherName = $fatherFirstName . ($fatherMiddleName ? " " . $fatherMiddleName : "") . " " . $fatherLastName;

// Emergency Contact Name
$emergencyFirstName = trim($_POST['emergencyFirstName']);
$emergencyMiddleName = trim($_POST['emergencyMiddleName']);
$emergencyLastName = trim($_POST['emergencyLastName']);
$emergencyName = $emergencyFirstName . ($emergencyMiddleName ? " " . $emergencyMiddleName : "") . " " . $emergencyLastName;

// Addresses
$street = trim($_POST['street']);
$barangay = trim($_POST['barangay']);
$city = trim($_POST['city']);
$province = trim($_POST['province']);
$postal = trim($_POST['postal']);
$address = "$street, $barangay, $city, $province, $postal";

$motherStreet = trim($_POST['motherStreet']);
$motherBarangay = trim($_POST['motherBarangay']);
$motherCity = trim($_POST['motherCity']);
$motherProvince = trim($_POST['motherProvince']);
$motherZip = trim($_POST['motherZip']);
$motherAddress = "$motherStreet, $motherBarangay, $motherCity, $motherProvince, $motherZip";

$fatherStreet = trim($_POST['fatherStreet']);
$fatherBarangay = trim($_POST['fatherBarangay']);
$fatherCity = trim($_POST['fatherCity']);
$fatherProvince = trim($_POST['fatherProvince']);
$fatherZip = trim($_POST['fatherZip']);
$fatherAddress = "$fatherStreet, $fatherBarangay, $fatherCity, $fatherProvince, $fatherZip";

// Other fields
$email = $_POST['email'];
$gender = $_POST['gender'];
$birthday = $_POST['birthday'];
$age = $_POST['age'];
$firstLanguage = $_POST['firstLanguage'];
$secondLanguage = $_POST['secondLanguage'];
$guardianContact = $_POST['guardianContact'];
$guardianRelationship = $_POST['guardianRelationship'];
$motherWork = $_POST['motherWork'];
$motherContact = $_POST['motherContact'];
$fatherWork = $_POST['fatherWork'];
$fatherContact = $_POST['fatherContact'];
$emergencyContact = $_POST['emergencyContact'];
$date = $_POST['date'] ?? date('Y-m-d');

// SQL Insert
$sql = "INSERT INTO pre_enrollment (
    full_name, email, gender, birthday, age, address,
    first_language, second_language, guardian, guardian_contact, guardian_relationship,
    mother_name, mother_address, mother_work, mother_contact,
    father_name, father_address, father_work, father_contact,
    emergency_name, emergency_contact, date
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

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
