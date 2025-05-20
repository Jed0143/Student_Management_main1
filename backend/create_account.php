<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// Helper function to check if a value is blank
function isBlank($value) {
    return !isset($value) || trim($value) === '';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        isBlank($data['email']) || isBlank($data['password']) ||
        isBlank($data['firstName']) || isBlank($data['middleName']) || isBlank($data['lastName']) ||
        isBlank($data['contactNo']) || isBlank($data['streetName']) || isBlank($data['barangay']) ||
        isBlank($data['city']) || isBlank($data['province']) || isBlank($data['postalCode']) ||
        isBlank($data['birthdate'])
    ) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    // Sanitize input
    $email = $conn->real_escape_string(trim($data['email']));
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    $role = 'parent';

    $firstName = $conn->real_escape_string(trim($data['firstName']));
    $middleName = $conn->real_escape_string(trim($data['middleName']));
    $lastName = $conn->real_escape_string(trim($data['lastName']));
    $contactNo = $conn->real_escape_string(trim($data['contactNo']));
    $streetName = $conn->real_escape_string(trim($data['streetName']));
    $barangay = $conn->real_escape_string(trim($data['barangay']));
    $city = $conn->real_escape_string(trim($data['city']));
    $province = $conn->real_escape_string(trim($data['province']));
    $postalCode = $conn->real_escape_string(trim($data['postalCode']));
    $birthdate = $conn->real_escape_string(trim($data['birthdate']));

    $fullName = "$firstName $middleName $lastName";

    // Combine address
    $address = "$streetName, Brgy. $barangay, $city, $province, $postalCode";
    $address = $conn->real_escape_string($address);

    // Check if email exists
    $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
    if ($check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
        exit;
    }

    // Insert into users table
    $sqlUser = "INSERT INTO users (full_name, email, password, role) 
                VALUES ('$fullName', '$email', '$hashedPassword', '$role')";

    if ($conn->query($sqlUser) === TRUE) {
        $userId = $conn->insert_id;

        // Insert into parent_accounts with full address
        $sqlParent = "INSERT INTO parent_accounts 
        (user_id, full_name, email, password, contact_no, address, birthdate) 
        VALUES 
        ('$userId', '$fullName', '$email', '$hashedPassword', '$contactNo', '$address', '$birthdate')";

        if ($conn->query($sqlParent) === TRUE) {
            echo json_encode(['status' => 'success']);
        } else {
            // Rollback user insert if parent insert fails
            $conn->query("DELETE FROM users WHERE id = '$userId'");
            echo json_encode(['status' => 'error', 'message' => 'Failed to save parent info']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to create user account']);
    }

    $conn->close();
}
?>
