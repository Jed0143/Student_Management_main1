<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connection.php';
$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data['id']) || empty($data['schedule'])) {
    echo json_encode(['success' => false, 'error' => 'Missing ID or schedule']);
    exit;
}

$id = (int)$data['id'];
$schedule = $conn->real_escape_string($data['schedule']);

$conn->begin_transaction();

try {
    // 1. Fetch student details
    $stmt = $conn->prepare("SELECT child_name, email FROM pre_enrollment WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $student = $result->fetch_assoc();
    $stmt->close();

    if (!$student) {
        throw new Exception("Student not found.");
    }

    // 2. Insert into students
    $stmt = $conn->prepare("INSERT INTO students (child_name, email, schedule) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $student['child_name'], $student['email'], $schedule);
    if (!$stmt->execute()) {
        throw new Exception("Insert into students failed: " . $stmt->error);
    }
    $stmt->close();

    // 3. Create parent login
    $defaultPassword = 'parent123'; // You can randomize this if needed
    $hashedPassword = password_hash($defaultPassword, PASSWORD_DEFAULT);
    $role = 'parent';

    // Check if user already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $student['email']);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $student['email'], $hashedPassword, $role);
        if (!$stmt->execute()) {
            throw new Exception("User account creation failed: " . $stmt->error);
        }
        $stmt->close();
    } else {
        $stmt->close();
    }

    // 4. Remove from pre_enrollment
    $stmt = $conn->prepare("DELETE FROM pre_enrollment WHERE id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Delete from pre_enrollment failed: " . $stmt->error);
    }
    $stmt->close();

    $conn->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Student accepted and parent login created.',
        'default_password' => $defaultPassword
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$output = ob_get_clean();
if (!empty(trim($output))) {
    echo json_encode(['success' => false, 'error' => 'Unexpected output: ' . strip_tags($output)]);
}
?>
