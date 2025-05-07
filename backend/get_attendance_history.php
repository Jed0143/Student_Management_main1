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
$username = "root";
$password = "";   
$dbname = "mpcar";   

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();  // Stop further execution if the connection failed
}

// Get student_id from the URL query string
$student_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($student_id == 0) {
    echo json_encode(["error" => "Student ID is required"]);
    exit();
}

// Query to get attendance history based on student_id and include student name
$sql = "
    SELECT
        s.id AS id,
        s.name AS name,
        a.date,
        a.status,
        a.note
    FROM attendance_records a
    INNER JOIN students s ON a.id = s.id
    WHERE a.id = $id
    ORDER BY a.date DESC
";

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
