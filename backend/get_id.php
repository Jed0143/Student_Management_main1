<?php
// getStudentData.php

// Allow CORS (optional, but useful during development)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$servername = "localhost";
$username = "root"; // your DB username
$password = ""; // your DB password
$database = "mpcar"; // your DB name

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get student ID from URL parameter
if (isset($_GET['id'])) {
    $studentId = intval($_GET['id']);

    // Query to fetch student data
    $sql = "SELECT * FROM pre_enrollment WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $studentId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if student found
    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
        echo json_encode($student);
    } else {
        echo json_encode(["error" => "Student not found."]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "No student ID provided."]);
}

$conn->close();
?>
