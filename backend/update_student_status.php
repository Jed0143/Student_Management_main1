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
$schoolYearStart = isset($data->school_year_start) ? $data->school_year_start : null;
$schoolYearEnd = isset($data->school_year_end) ? $data->school_year_end : null;

if (!$schoolYearStart || !$schoolYearEnd) {
    echo json_encode(["message" => "School year start and end are required."]);
    exit;
}

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

// Step 2: Update status and school year in pre_enrollment
$updateStmt = $conn->prepare("UPDATE pre_enrollment SET status = ?, school_year_start = ?, school_year_end = ? WHERE id = ?");
$newStatus = 'accepted';
$updateStmt->bind_param("sssi", $newStatus, $schoolYearStart, $schoolYearEnd, $id);

if ($updateStmt->execute()) {
    // Step 3: Insert into enrollees table (with school year)
    $insertStmt = $conn->prepare("INSERT INTO enrollees (enrollee_id, full_name, email, school_year_start, school_year_end) VALUES (?, ?, ?, ?, ?)");
    $insertStmt->bind_param("issss", $id, $fullName, $email, $schoolYearStart, $schoolYearEnd);

    if ($insertStmt->execute()) {
        // Step 4: Check if email already exists in users
        $checkUserStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $checkUserStmt->bind_param("s", $email);
        $checkUserStmt->execute();
        $userResult = $checkUserStmt->get_result();

        if ($userResult->num_rows > 0) {
            echo json_encode(["message" => "Enrollee added, but user already exists in users."]);
        } else {
            // Step 5: Insert into users
            $defaultPassword = password_hash("student123", PASSWORD_DEFAULT);
            $role = 'parent';

            $userStmt = $conn->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
            $userStmt->bind_param("ssss", $fullName, $email, $defaultPassword, $role);

            if ($userStmt->execute()) {
                echo json_encode(["message" => "Student accepted and added to enrollees and users."]);
            } else {
                echo json_encode(["message" => "Enrollee added, but failed to insert into users: " . $userStmt->error]);
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
