<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db_connection.php';
$conn = getDBConnection();

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$schedule = $data['schedule'] ?? '';

if (!$id || !$schedule) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$stmt = $conn->prepare("UPDATE students SET schedule = ? WHERE id = ?");
$stmt->bind_param("si", $schedule, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Schedule updated"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
