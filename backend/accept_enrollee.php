<?php
// Start output buffering to prevent unintended output
ob_start();

// Allow CORS and set content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Error reporting (keep for dev, disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include DB connection
include 'db_connection.php';
$conn = getDBConnection(); // use the fixed getDBConnection() function

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

// Decode JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate input
if (empty($data['id']) || empty($data['schedule'])) {
    echo json_encode(['success' => false, 'error' => 'Missing ID or schedule']);
    exit;
}

// Sanitize input
$id = (int)$data['id'];
$schedule = $conn->real_escape_string($data['schedule']);

$conn->begin_transaction();

try {
    // Step 1: Fetch student from pre_enrollment
    $stmt = $conn->prepare("SELECT child_name, email FROM pre_enrollment WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $student = $result->fetch_assoc();
    $stmt->close();

    if (!$student) {
        throw new Exception("Student not found.");
    }

    // Step 2: Insert into students
    $stmt = $conn->prepare("INSERT INTO students (child_name, email, schedule) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $student['child_name'], $student['email'], $schedule);
    if (!$stmt->execute()) {
        throw new Exception("Insert failed: " . $stmt->error);
    }
    $stmt->close();

    // Step 3: Delete from pre_enrollment
    $stmt = $conn->prepare("DELETE FROM pre_enrollment WHERE id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Delete failed: " . $stmt->error);
    }
    $stmt->close();

    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Catch and handle any accidental output
$output = ob_get_clean();
if (!empty(trim($output))) {
    echo json_encode(['success' => false, 'error' => 'Unexpected output: ' . strip_tags($output)]);
}
?>
