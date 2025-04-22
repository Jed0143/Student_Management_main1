<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include("db_connection.php");
$conn = getDBConnection();

// Read POST values
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validate inputs
if (empty($email) || empty($password)) {
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required."
    ]);
    exit;
}

// Query the database
$query = $conn->prepare("SELECT * FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

// Check if user exists
if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "User not found."
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Check password (No hashing)
if ($password !== $user['password']) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid credentials."
    ]);
    exit;
}

// Success
$response = [
    "status" => "success",
    "role" => $user['role'],
    "user" => [
        "id" => $user['id'],
        "email" => $user['email']
    ]
];

echo json_encode($response);
$conn->close();
?>
