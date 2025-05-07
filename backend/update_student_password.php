<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_management";

// Connect to DB
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read JSON body
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['password'])) {
        $id = (int) $data['id'];
        $newPassword = $conn->real_escape_string($data['password']); // Escape to prevent SQL injection

        $sql = "UPDATE pre_enrollment SET password = '$newPassword' WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Password updated successfully']);
        } else {
            echo json_encode(['message' => 'Error updating password: ' . $conn->error]);
        }
    } else {
        echo json_encode(['message' => 'Missing id or password']);
    }
    $conn->close();
    exit;
}
?>
