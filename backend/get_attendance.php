<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$attendance = [];

if (isset($_GET['student_id'])) {
    $studentId = intval($_GET['student_id']);

    $sql = "SELECT date, status, note 
            FROM pre_enrollment 
            WHERE student_id = ? 
            ORDER BY date DESC";

    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $studentId);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $attendance[] = $row;
        }

        echo json_encode(["success" => true, "data" => $attendance]);
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing statement."]);
    }

} else if (isset($_GET['full_name'])) {
    $fullName = trim($_GET['full_name']);

    $sql = "SELECT date, status, note 
            FROM attendance 
            WHERE LOWER(full_name) = LOWER(?) 
            ORDER BY date DESC";

    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("s", $fullName);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $attendance[] = $row;
        }

        echo json_encode(["success" => true, "data" => $attendance]);
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing statement."]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Missing student_id or full_name."]);
}

$conn->close();
?>
