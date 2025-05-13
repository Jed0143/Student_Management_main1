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

// Step 1: Check current status and get full_name and email
$checkStmt = $conn->prepare("SELECT status, full_name, email FROM pre_enrollment WHERE id = ?");
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
$email = $row['email'];

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
        // Step 4: Check if email already exists in admin_users
        $checkUserStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $checkUserStmt->bind_param("s", $email);
        $checkUserStmt->execute();
        $userResult = $checkUserStmt->get_result();

        if ($userResult->num_rows > 0) {
            echo json_encode(["message" => "Enrollee added, but user already exists in users."]);
        } else {

            // Step 5: Insert users
            $defaultPassword = password_hash("student123", PASSWORD_DEFAULT);
            $role = 'parent';

            $userStmt = $conn->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
            $userStmt->bind_param("ssss", $fullName, $email, $defaultPassword, $role);

            if ($userStmt->execute()) {
                echo json_encode(["message" => "Student accepted and added to enrollees and admin_users."]);
            } else {
                echo json_encode(["message" => "Enrollee added, but failed to insert into admin_users: " . $userStmt->error]);
            }

            $userStmt->close();
        }

        $checkUserStmt->close();
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
