<?php
header("Content-Type: application/json");
include "db.php"; // your DB connection

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$current_password = $data->current_password ?? '';
$new_password = $data->new_password ?? '';

if (!$email || !$current_password || !$new_password) {
    echo json_encode(["success" => false, "message" => "Missing input."]);
    exit;
}

// Get current hashed password
$stmt = $conn->prepare("SELECT password FROM pre enrollment WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found."]);
    exit;
}

$stmt->bind_result($hashed_password);
$stmt->fetch();

// Verify current password
if (!password_verify($current_password, $hashed_password)) {
    echo json_encode(["success" => false, "message" => "Current password is incorrect."]);
    exit;
}

// Update to new password
$new_hashed = password_hash($new_password, PASSWORD_DEFAULT);
$update = $conn->prepare("UPDATE pre_enrollment SET password = ? WHERE email = ?");
$update->bind_param("ss", $new_hashed, $email);

if ($update->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Database update failed."]);
}
?>
