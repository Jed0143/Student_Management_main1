<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "student_management";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit();
}

$sql = "SELECT id, full_name, email FROM users WHERE role = 'admin'";

$result = $conn->query($sql);

if ($result === false) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database query error: " . $conn->error
    ]);
    $conn->close();
    exit();
}

$teachers = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $teachers[] = $row;
    }
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "teachers" => $teachers
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "success" => true,  // success true but no data
        "teachers" => [],
        "message" => "No teachers found."
    ]);
}

$conn->close();
?>
