<?php
header('Content-Type: application/json');

// Connect to database
$conn = new mysqli("localhost", "root", "", "mpcar");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit();
}

$email = $_GET['email'] ?? '';

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Email is required."]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM pre_enrollment WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    echo json_encode(["status" => "success", "student" => $student]);
} else {
    echo json_encode(["status" => "error", "message" => "No student found with this email."]);
}

$stmt->close();
$conn->close();
?>
