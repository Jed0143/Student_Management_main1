<?php
header('Content-Type: application/json');

// DB connection setup
$servername = "localhost";
$username = "root";  // replace with your DB username
$password = "";  // replace with your DB password
$dbname = "student_management"; // replace with your DB name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Teacher ID is required"]);
    exit();
}

$id = intval($data['id']);

// Get current status from users table
$sql_select = "SELECT status FROM users WHERE id = ?";
$stmt_select = $conn->prepare($sql_select);
$stmt_select->bind_param("i", $id);
$stmt_select->execute();
$stmt_select->bind_result($current_status);

if (!$stmt_select->fetch()) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Teacher not found"]);
    $stmt_select->close();
    $conn->close();
    exit();
}
$stmt_select->close();

// Toggle the status: if 1 then 0, if 0 then 1
$new_status = $current_status == 1 ? 0 : 1;

// Update status in users table
$sql_update = "UPDATE users SET status = ? WHERE id = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("ii", $new_status, $id);

if ($stmt_update->execute()) {
    echo json_encode([
        "success" => true,
        "message" => $new_status ? "Teacher removed." : "Teacher restored.",
        "new_status" => $new_status
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update status"]);
}

$stmt_update->close();
$conn->close();
?>
