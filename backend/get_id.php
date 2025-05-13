<?php
// get_student_by_email.php

// Allow CORS (optional, but useful during development)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get student email from URL parameter
if (isset($_GET['email'])) {
    $email = $_GET['email'];

    // Query to fetch student data by email
    $sql = "SELECT * FROM pre_enrollment WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if there are results
    if ($result->num_rows > 0) {
        $students = [];
        while ($student = $result->fetch_assoc()) {
            $students[] = $student;  // Collect all students with the same email
        }
        echo json_encode($students);  // Return all students as a JSON array
    } else {
        echo json_encode(["error" => "No students found with this email."]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "No email provided."]);
}

$conn->close();
?>
