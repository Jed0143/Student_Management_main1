<?php
header('Content-Type: application/json');

// DB connection settings
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_management";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get teacher_name from GET parameter
$teacher_name = isset($_GET['teacher_name']) ? $_GET['teacher_name'] : '';

if (empty($teacher_name)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing teacher_name parameter"]);
    exit();
}

// Prepare and bind statement to avoid SQL injection
$stmt = $conn->prepare("SELECT * FROM pre_enrollment WHERE teacher_name = ?");
$stmt->bind_param("s", $teacher_name);

$stmt->execute();

$result = $stmt->get_result();

$students = [];

while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

if (count($students) > 0) {
    echo json_encode($students);
} else {
    echo json_encode(["error" => "No students found for teacher_name: $teacher_name"]);
}

$stmt->close();
$conn->close();
?>
