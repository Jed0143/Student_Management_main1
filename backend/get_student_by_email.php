<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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
    $sql = "SELECT * FROM pre_enrollment WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
        echo json_encode($student);
    } else {
        echo json_encode(["error" => "Student not found."]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "No email provided."]);
}

$conn->close();
?>
