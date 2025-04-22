<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// DB connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mpcar";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['schedule'])) {
    $id = $data['id'];
    $schedule = $data['schedule'];

    $stmt = $conn->prepare("UPDATE pre_enrollment SET schedule = ? WHERE id = ?");
    $stmt->bind_param("si", $schedule, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Schedule updated successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to update schedule."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Missing 'id' or 'schedule' in request."]);
}

$conn->close();
?>
