<?php
header('Content-Type: application/json');

// Database connection parameters
$host = "localhost";
$dbname = "student_management";  // replace with your DB name
$username = "root";  // replace with your DB username
$password = "";  // replace with your DB password

// Connect to database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['teacher_id']) || !isset($input['status'])) {
    echo json_encode(["success" => false, "message" => "Invalid input."]);
    exit;
}

$teacher_id = intval($input['teacher_id']);
$status = trim($input['status']);

try {
    // Assuming your teachers table has a column named `status`
    $stmt = $pdo->prepare("UPDATE users SET status = :status WHERE id = :id");
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':id', $teacher_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Teacher status updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "No rows updated. Check if teacher exists or status is unchanged."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Update failed: " . $e->getMessage()]);
}
