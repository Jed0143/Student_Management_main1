<?php
// Allow CORS for local development
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Error reporting setup (turn off in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

include("db_connection.php");
$conn = getDBConnection();

// Correctly parse JSON body if $_POST is empty
if (empty($_POST)) {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $_POST = is_array($data) ? $data : [];
}

// Get email and password
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required."
    ]);
    exit;
}

// 🛡️ Query to check the user
$query = $conn->prepare("SELECT * FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Validate password directly if it's not hashed
if (password_verify($password, $user['password'])) {
    // 🎉 Success, send response
    $role = $user['role'] ?? 'parent'; // Default to 'parent' if no role is set

    // Handle different roles
    if ($role === 'super_admin' || $role === 'admin' || $role === 'parent') {
        echo json_encode([
            "status" => "success",
            "role" => $role,
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "type" => 'users'
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid role assigned."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid credentials."
    ]);
}

} else {
    echo json_encode([
        "status" => "error",
        "message" => "User not found."
    ]);
}

$conn->close();
?>
