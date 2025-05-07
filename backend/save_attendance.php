<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

// Establish database connection
$conn = new mysqli($servername, $username, $password, $database);

// Check if the connection was successful
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['students'])) {
        $students = $data['students'];

        // Prepare the SQL query to insert attendance data
        $stmt = $conn->prepare("INSERT INTO attendance (date, status, note, student_id) VALUES (?, ?, ?, ?)");

        // Loop through the students array and insert each student's attendance record
        foreach ($students as $student) {
            // Get the data for each student
            $date = $student['attendance'][0]['date'];
            $status = $student['attendance'][0]['status'];
            $note = $student['attendance'][0]['note'];
            $student_id = $student['id']; // Using student ID from the frontend

            // Debugging: Check what data is being inserted
            error_log("Inserting attendance for student ID $student_id: Date=$date, Status=$status, Note=$note");

            // Bind parameters and execute
            if ($stmt->bind_param('sssi', $date, $status, $note, $student_id)) {
                if (!$stmt->execute()) {
                    // Log the error if execution fails
                    error_log("Error executing statement: " . $stmt->error);
                }
            } else {
                // Log parameter binding error
                error_log("Error binding parameters: " . $stmt->error);
            }
        }

        // Send a success response
        echo json_encode(['success' => true, 'message' => 'Attendance saved successfully']);
    } else {
        // Send an error response if invalid data
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
    }
} else {
    // Handle invalid request methods
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Close the database connection
$conn->close();
?>
