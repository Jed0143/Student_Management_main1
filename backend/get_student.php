<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Modified query to only fetch students where status is 'pending'
$sql = "SELECT * FROM pre_enrollment WHERE status = 'pending'";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . $conn->error]);
    exit;
}

$students = [];

while ($row = $result->fetch_assoc()) {
    $details = $row;
    unset($details['id'], $details['full_name'], $details['schedule']); // remove main keys from details

    $students[] = [
        "id" => (int)$row["id"],
        "full_name" => $row["full_name"],
        "email" => $row["email"], // <- Added email as a top-level field
        "schedule" => isset($row["schedule"]) ? $row["schedule"] : null,
        "details" => $details // email will still be inside here too unless you remove it above
    ];
}

// Return the list of students
echo json_encode($students);
$conn->close();
?>
