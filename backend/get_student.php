<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db_connection.php';
$conn = getDBConnection();

$sql = "SELECT * FROM pre_enrollment";
$result = $conn->query($sql);

$pre_enrollment = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $pre_enrollment[] = $row;
    }
    echo json_encode(['pre_enrollment' => $pre_enrollment]);
} else {
    echo json_encode(['pre_enrollment' => []]);
}

$conn->close();
?>
