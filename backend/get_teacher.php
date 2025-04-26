<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$user = "root";
$password = "";
$dbname = "mpcar"; // <-- Replace this with your actual database name

$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit();
}

// Fetch all teachers
$sql = "SELECT id, fullname, email, password FROM teachers";
$result = $conn->query($sql);

$teachers = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $teachers[] = $row;
    }

    echo json_encode([
        "success" => true,
        "teachers" => $teachers
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No teachers found."
    ]);
}

$conn->close();
?>
