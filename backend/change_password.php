<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


$host = "localhost";
$user = "root";
$password = "";
$dbname = "student_management";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

$id = $data->id ?? '';
$new_password = $data->new_password ?? '';

if (!$id || !$new_password) {
    echo json_encode(["status" => "error", "message" => "Missing input."]);
    exit;
}

// Log to check if the received id and new_password are correct
error_log("Received ID: $id, New Password: $new_password");

$new_hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "SQL prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("si", $new_hashed_password, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Database update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
