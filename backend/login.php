<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include("db_connection.php");
$conn = getDBConnection();

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required."
    ]);
    exit;
}

$query = $conn->prepare("SELECT * FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "User not found."
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Plain-text password check for now
if ($password !== $user['password']) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid credentials."
    ]);
    exit;
}

echo json_encode([
    "status" => "success",
    "role" => $user['role'] ?? 'parent', // fallback if role doesn't exist
    "user" => [
        "id" => $user['id'],
        "email" => $user['email']
    ]
]);

$conn->close();
?>
