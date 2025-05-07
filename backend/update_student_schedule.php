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
$database = "mpcar";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Invalid request method. Use POST."]);
    exit();
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the data contains 'id' and 'schedule'
if (isset($data['id']) && isset($data['schedule'])) {
    $id = $conn->real_escape_string($data['id']);
    $schedule = $conn->real_escape_string($data['schedule']);

    // Prepare the SQL query for INSERT
    $sql = "INSERT INTO students (id, schedule) VALUES ('$id', '$schedule')";

    // Execute the query
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Record inserted successfully"]);
    } else {
        echo json_encode(["error" => "SQL Error: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Missing required data. Both 'id' and 'schedule' are required."]);
}

$conn->close();
?>
