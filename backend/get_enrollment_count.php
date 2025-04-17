<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Enable error reporting (only during dev)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Connect to database
$conn = new mysqli("localhost", "root", "", "mpcar");

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Query to get enrollment count
$sql = "SELECT COUNT(*) as count FROM pre_enrollment";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . $conn->error]);
    exit;
}

$row = $result->fetch_assoc();
$max_slots = 10;
$slots_remaining = $max_slots - intval($row["count"]);

echo json_encode(["slots_remaining" => $slots_remaining]);
$conn->close();
?>
