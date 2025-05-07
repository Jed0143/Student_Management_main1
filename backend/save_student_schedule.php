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

// Validate only 'id' and 'schedule' (not full_name or email)
if (isset($data['id']) && isset($data['schedule'])) {
    $id = $conn->real_escape_string($data['id']);
    $schedule = $conn->real_escape_string($data['schedule']);

    // Update query
    $sql = "UPDATE pre_enrollment SET schedule='$schedule' WHERE id='$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to update schedule: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid input. 'id' and 'schedule' are required."]);
}

$conn->close();
?>
