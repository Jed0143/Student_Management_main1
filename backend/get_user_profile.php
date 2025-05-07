<?php
// get_user_profile.php

header('Content-Type: application/json');
require_once 'db_connection.php'; // Ensure this contains your database connection

// Get the input data (email)
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];

if (!$email) {
    echo json_encode(["status" => "error", "message" => "Email is required."]);
    exit;
}

$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(["status" => "success", "user" => $user]);
} else {
    echo json_encode(["status" => "error", "message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>
