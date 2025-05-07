<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// ✅ Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ Database connection settings
$servername = "localhost";
$username   = "root";
$password   = "";
$database   = "student_management";

$email = $_GET['email'];
error_log("Searching for pre_enrollment with email: " . $email);

// ✅ Create connection
$conn = new mysqli($servername, $username, $password, $database);

// ✅ Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// ✅ Check if email is provided
if (!isset($_GET['email'])) {
    http_response_code(400);
    echo json_encode(["error" => "Email parameter is missing."]);
    exit;
}

$email = $_GET['email'];

// ✅ Prepare and execute query
$query = "SELECT * FROM pre_enrollment WHERE email = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // If schedule field is empty or null, give fallback
    if (!isset($row['schedule']) || trim($row['schedule']) === '') {
        $row['schedule'] = 'Not Assigned';
    }

    echo json_encode($row);
} else {
    http_response_code(404);
    echo json_encode(["error" => "No data found for the provided email."]);
}

$stmt->close();
$conn->close();
?>
