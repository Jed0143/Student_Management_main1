<?php
header('Content-Type: application/json');

// DB connection config
$host = 'localhost';
$dbname = 'student_management';
$user = 'root';
$pass = '';

// Connect to MySQL
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get email from GET parameter and sanitize
if (!isset($_GET['email']) || empty(trim($_GET['email']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing email parameter']);
    exit;
}

$email = trim($_GET['email']);

try {
    // Correct SQL query
    $stmt = $pdo->prepare("SELECT id, full_name AS full_name, schedule FROM pre_enrollment WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['students' => $students]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed']);
}
?>
