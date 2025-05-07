<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Fetch students with their full name and schedule
$sql = "SELECT id, full_name, email, schedule FROM pre_enrollment WHERE status = 'accepted'";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . $conn->error]);
    exit;
}

$students = [];

while ($row = $result->fetch_assoc()) {
    $students[] = [
        "id" => (int)$row["id"],
        "full_name" => $row["full_name"],
        "email" => $row["email"],
        "schedule" => isset($row["schedule"]) ? $row["schedule"] : null
    ];
}

echo json_encode($students);
$conn->close();
?>
