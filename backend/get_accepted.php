<?php
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

// DB connection
$host = "localhost";
$user = "root"; // Change if needed
$pass = "";     // Change if needed
$dbname = "student_management";

// Create a new connection to the database
$conn = new mysqli($host, $user, $pass, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    // Send error message in JSON format
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// SQL query to fetch accepted students with a non-null schedule
$sql = "SELECT id, full_name, schedule FROM pre_enrollment WHERE status = 'accepted' AND schedule IS NOT NULL AND schedule != ''";
$result = $conn->query($sql);

// Initialize an empty array to store student data
$students = [];

// Check if there are results from the query
if ($result && $result->num_rows > 0) {
    // Fetch each row and add it to the students array
    while ($row = $result->fetch_assoc()) {
        $students[] = [
            "id" => (int)$row["id"],
            "full_name" => $row["full_name"],
            "schedule" => $row["schedule"]
        ];
    }
} else {
    // No students found, return an empty array
    $students = [];
}

// Send the student data as JSON response
echo json_encode($students);

// Close the database connection
$conn->close();
?>
