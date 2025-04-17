<?php
// Set CORS and Content-Type headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure this script only processes POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

include 'db_connection.php';
$conn = getDBConnection();

// Get and decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
$response = [];

if (!empty($data['attendance']) && is_array($data['attendance'])) {
    foreach ($data['attendance'] as $entry) {
        // Use null coalescing to handle missing keys
        $studentId = $conn->real_escape_string($entry['id'] ?? '');
        $studentName = $conn->real_escape_string($entry['child_name'] ?? '');
        $date = $conn->real_escape_string($entry['date'] ?? '');
        $present = isset($entry['present']) ? ($entry['present'] ? 1 : 0) : 0;
        $note = $conn->real_escape_string($entry['note'] ?? '');

        // Validate required fields
        if (!$studentId || !$date) {
            $response[] = [
                "id" => $studentId,
                "error" => "Missing student ID or date"
            ];
            continue;
        }

        // Prepare and execute insert query
        $sql = "INSERT INTO attendance (student_id, child_name, date, present, note)
                VALUES ('$studentId', '$studentName', '$date', '$present', '$note')";

        if (!$conn->query($sql)) {
            $response[] = [
                "id" => $studentId,
                "error" => $conn->error
            ];
        }
    }

    if (empty($response)) {
        echo json_encode(["success" => true, "message" => "Attendance saved successfully."]);
    } else {
        echo json_encode(["success" => false, "errors" => $response]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No attendance data received."]);
}

$conn->close();
?>
