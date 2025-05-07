<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !is_numeric($data['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing or invalid student ID.", "data" => $data]);
    exit;
}

$id = intval($data['id']);

// Connect to DB
$conn = new mysqli("localhost", "root", "", "student_management");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Check if the student exists first
$check = $conn->prepare("SELECT id FROM pre_enrollment WHERE id = ?");
$check->bind_param("i", $id);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Student not found."]);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

// Delete student
$stmt = $conn->prepare("DELETE FROM pre_enrollment WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Student deleted successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to delete student. Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
