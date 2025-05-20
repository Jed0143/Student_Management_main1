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
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Get optional teacher_name from GET parameters
$teacherName = isset($_GET['teacher_name']) ? trim($_GET['teacher_name']) : null;

// Base SQL query
$sql = "SELECT id, full_name, schedule FROM pre_enrollment WHERE status = 'accepted' AND schedule IS NOT NULL AND schedule != ''";

// Add teacher_name filter if provided
if (!empty($teacherName)) {
    $sql .= " AND teacher_name = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $teacherName);
} else {
    $stmt = $conn->prepare($sql);
}

// Execute and get results
$stmt->execute();
$result = $stmt->get_result();

$students = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $students[] = [
            "id" => (int)$row["id"],
            "full_name" => $row["full_name"],
            "schedule" => $row["schedule"]
        ];
    }
}

// Return results
echo json_encode($students);

// Close everything
$stmt->close();
$conn->close();
?>
