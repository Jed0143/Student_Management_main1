<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!$data || !isset($data['date']) || !isset($data['students']) || !is_array($data['students'])) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input."]);
    exit;
}

$date = $data['date'];
$students = $data['students'];

// Log the received data
error_log("Received Data: " . print_r($data, true));

$conn = new mysqli("localhost", "root", "", "student_management");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

// Insert each student's attendance
foreach ($students as $student) {
    $status = $student['status'];
    $reason = $student['reason'];
    $full_name = $student['full_name'];

    // Log values before executing the query
    error_log("Inserting attendance: Status: $status, Reason: $reason, Full Name: $full_name");

    // Prepare the SQL query
    $stmt = $conn->prepare("INSERT INTO attendance (date, status, reason, full_name) VALUES (?, ?, ?, ?)");
    
    if ($stmt === false) {
        error_log("Error preparing query: " . $conn->error);
        continue;
    }

    // Bind parameters
    if (!$stmt->bind_param("ssss", $date, $status, $reason, $full_name)) {
        error_log("Error binding parameters: " . $stmt->error);
        continue;
    }

    // Execute query and log any failures
    if (!$stmt->execute()) {
        error_log("Error executing query for student: $full_name - " . $stmt->error);
    } else {
        error_log("Successfully inserted attendance for student: $full_name");
    }
}

$stmt->close();
$conn->close();

echo json_encode(["message" => "Attendance saved successfully."]);
?>
