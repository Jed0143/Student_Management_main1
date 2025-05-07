<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_GET['action'] ?? null;

    if ($action === 'delete') {
        // Decode JSON body manually
        $input = json_decode(file_get_contents("php://input"), true);

        if (isset($input['id'])) {
            $id = (int) $input['id'];

            $conn = new mysqli("localhost", "root", "", "student_management");

            if ($conn->connect_error) {
                echo json_encode(["status" => "error", "message" => "DB connection failed"]);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(["status" => "success", "message" => "Teacher deleted successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Teacher not found or already deleted"]);
            }

            $stmt->close();
            $conn->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Missing teacher ID"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
    }
}
?>
