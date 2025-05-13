<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');


$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if (isset($_GET['email'])) {
    $email = $conn->real_escape_string($_GET['email']);

    $sql = "SELECT full_name FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["userId" => $row['full_name']]);
    } else {
        echo json_encode(["error" => "User not found"]);
    }
} else {
    echo json_encode(["error" => "Email is required"]);
}

$conn->close();
?>
