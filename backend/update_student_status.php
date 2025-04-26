<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->status)) {
    echo json_encode(["message" => "Missing required fields."]);
    exit;
}

$id = $data->id;
$status = $data->status;

$conn = new mysqli("localhost", "root", "", "pre_enrollment");

if ($conn->connect_error) {
    echo json_encode(["message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$stmt = $conn->prepare("UPDATE students SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Student status updated successfully."]);
} else {
    echo json_encode(["message" => "Error updating student status: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
