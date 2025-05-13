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

// Query to fetch all students
$query = "SELECT id, full_name AS name FROM students";  // Assuming your students table has columns 'id' and 'full_name'
$result = $conn->query($query);

if ($result) {
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
    echo json_encode($students);  // Return the students as a JSON response
} else {
    echo json_encode(["error" => "Query error: " . $conn->error]);
}

$conn->close();
?>
