<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

// Connect to database
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (isset($data['id']) && isset($data['schedule']) && isset($data['teacher_name'])) {
    $id = $conn->real_escape_string($data['id']);
    $schedule = $conn->real_escape_string($data['schedule']);
    $teacher_name = $conn->real_escape_string($data['teacher_name']);

    // Update query (set both schedule and teacher_name)
    $sql = "UPDATE pre_enrollment SET schedule='$schedule', teacher_name='$teacher_name' WHERE id='$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to update: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid input. 'id', 'schedule', and 'teacher_name' are required."]);
}

$conn->close();
?>
