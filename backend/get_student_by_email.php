<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// DB connection
$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if (isset($_GET['email'])) {
    $email = $_GET['email'];

$sql = "SELECT id, full_name, email, schedule, gender, birthday, age, address, guardian, guardian_contact, guardian_relationship, father_name, mother_name, emergency_contact, emergency_name, teacher_name FROM pre_enrollment WHERE WHERE email = ?";
$result = $conn->query($sql);

    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    echo json_encode(["students" => $students]);

    $stmt->close();
} else {
    echo json_encode(["error" => "No email provided."]);
}

$conn->close();
?>
