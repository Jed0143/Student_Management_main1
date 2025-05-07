<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["message" => "Missing student ID."]);
    exit;
}

$id = $data->id;

$conn = new mysqli("localhost", "root", "", "student_management");

if ($conn->connect_error) {
    echo json_encode(["message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Step 1: Check current status and get full_name
$checkStmt = $conn->prepare("SELECT status, full_name FROM pre_enrollment WHERE id = ?");
$checkStmt->bind_param("i", $id);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["message" => "Student not found."]);
    $checkStmt->close();
    $conn->close();
    exit;
}

$row = $result->fetch_assoc();
$currentStatus = $row['status'];
$fullName = $row['full_name'];

if ($currentStatus !== 'pending') {
    echo json_encode(["message" => "Student already accepted."]);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Step 2: Update status to 'accepted'
$updateStmt = $conn->prepare("UPDATE pre_enrollment SET status = ? WHERE id = ?");
$newStatus = 'accepted';
$updateStmt->bind_param("si", $newStatus, $id);

if ($updateStmt->execute()) {
    // Step 3: Insert into enrollees table
    $insertStmt = $conn->prepare("INSERT INTO enrollees (enrollee_id, full_name, email) VALUES (?, ?, ?)");
    $insertStmt->bind_param("iss", $id, $fullName, $email);

    if ($insertStmt->execute()) {
        echo json_encode(["message" => "Student accepted and added to enrollees."]);
    } else {
        echo json_encode(["message" => "Status updated but failed to insert into enrollees: " . $insertStmt->error]);
    }

    $insertStmt->close();
} else {
    echo json_encode(["message" => "Failed to update status: " . $updateStmt->error]);
}

$updateStmt->close();
$conn->close();
?>
