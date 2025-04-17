<?php
// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connection.php'; 

// Database connection credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mpcar";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Query to fetch enrollees
$sql = "SELECT id, child_name, email FROM pre_enrollment";
$result = $conn->query($sql);

// Initialize an array to store the enrollees
$enrollees = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $enrollees[] = $row;
    }
}

// Return array directly (not wrapped in 'enrollees' key)
echo json_encode($enrollees);
$conn->close();
?>
