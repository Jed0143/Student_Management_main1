<?php
// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection details
include 'db_connection.php'; 

// Database connection credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mpcar";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// SQL query to fetch enrollees including schedule
$sql = "SELECT id, child_name, email, schedule FROM pre_enrollment";
$result = $conn->query($sql);

// Initialize an array to store the enrollees
$enrollees = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Add each row to the enrollees array
        $enrollees[] = $row;
    }
} else {
    // Handle the case when no records are found
    $enrollees = [];
}

// Return the enrollees as JSON
echo json_encode($enrollees);

// Close the database connection
$conn->close();
?>
