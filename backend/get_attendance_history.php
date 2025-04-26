<?php
// Enable error reporting for debugging (remove this in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Allow cross-origin requests (useful if frontend and backend are on different domains)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Database connection (replace with your actual DB connection details)
$servername = "localhost";
$username = "root";  // replace with your DB username
$password = "";      // replace with your DB password
$dbname = "mpcar";   // replace with your DB name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();  // Stop further execution if the connection failed
}

// Get student_id from the URL query string
$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;

if ($student_id == 0) {
    echo json_encode(["error" => "Student ID is required"]);
    exit();
}

// Query to get attendance history
$sql = "SELECT date, status, note FROM attendance WHERE student_id = $student_id ORDER BY date DESC";
$result = $conn->query($sql);

// Check if query execution was successful
if ($result === false) {
    echo json_encode(["error" => "Error executing query: " . $conn->error]);
    exit();
}

// Check if there are any results
if ($result->num_rows > 0) {
    // Fetch all attendance records and return as JSON
    $attendance = [];
    while ($row = $result->fetch_assoc()) {
        $attendance[] = $row;
    }
    echo json_encode(["attendance" => $attendance]);
} else {
    echo json_encode(["attendance" => []]);  // No attendance found for this student
}

// Close the database connection
$conn->close();
?>
