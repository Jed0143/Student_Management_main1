<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "student_management";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$student_id = isset($_GET['student_id']) ? $conn->real_escape_string($_GET['student_id']) : null;
$date = isset($_GET['date']) ? $conn->real_escape_string($_GET['date']) : null;

$sql = "SELECT id, student_id, full_name, date, status, note FROM attendance";
$conditions = [];

if ($student_id !== null) {
    $conditions[] = "student_id = '$student_id'";
}
if ($date !== null) {
    $conditions[] = "date = '$date'";
}

if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$sql .= " ORDER BY date DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Query error: " . $conn->error]);
    exit;
}

$attendance = [];

while ($row = $result->fetch_assoc()) {
    $attendance[] = $row;
}

echo json_encode(["success" => true, "data" => $attendance]);
$conn->close();
?>
