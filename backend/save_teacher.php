<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Ensure JSON response

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_management";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get raw POST data
$rawData = file_get_contents("php://input");
file_put_contents('php://stderr', "Raw POST data: " . $rawData . "\n");

// Decode the JSON data
$data = json_decode($rawData, true);

// Log incoming data for debugging
file_put_contents('php://stderr', print_r($data, true)); // Logs incoming data to error log

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON data received."]);
    exit;
}

$name = $data['full_name'] ?? '';
$email = $data['email'] ?? '';
$passwordRaw = $data['password'] ?? '';
$role = $data['role'] ?? 'admin';

// Check if all required fields are present
if (!$name || !$email || !$passwordRaw) {
    echo json_encode(["status" => "error", "message" => "Missing required fields (Full Name, Email, Password)."]);
    exit;
}

// Prepare SQL query to insert new teacher
$stmt = $conn->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssss", $name, $email, $passwordRaw, $role); // Using plain password, no hashing

// Execute the query
if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Insert failed: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

// Success response
echo json_encode(["status" => "success", "message" => "Teacher saved successfully"]);

$stmt->close();
$conn->close();
exit;
?>
