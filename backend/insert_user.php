<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';  // No password sent
$role = $data['role'] ?? 'parent';

// Set a default password if none is provided
if (empty($password)) {
    $password = "defaultpassword123";  // Default password
}

if (empty($email) || empty($role)) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

$checkQuery = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkQuery->bind_param("s", $email);
$checkQuery->execute();
$result = $checkQuery->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "User already exists."]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $hashedPassword, $role);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User created successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to insert user: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
