<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Corrected connection credentials
$host = "localhost";
$username = "root";              // ✅ use your MySQL username
$password = "";                  // ✅ use your MySQL password (often blank in XAMPP)
$database = "student_management"; // ✅ your database name

// Create mysqli connection
$conn = new mysqli($host, $username, $password, $database);

// Check for connection error
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if (isset($_GET['name'])) {
    $fullName = $conn->real_escape_string($_GET['name']);

    $query = "SELECT date, status, reason FROM attendance WHERE full_name = '$fullName' ORDER BY date DESC";
    $result = $conn->query($query);

    if ($result) {
        $attendanceRecords = [];
        while ($row = $result->fetch_assoc()) {
            $attendanceRecords[] = $row;
        }
        echo json_encode($attendanceRecords);
    } else {
        echo json_encode(["error" => "Query error: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Missing full name"]);
}

$conn->close();
?>
