<?php
include 'db_connection.php';

$fullname = $_POST['fullname'];
$child_name = $_POST['child_name']; // <-- Added
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (fullname, child_name, email, password, status)
        VALUES ('$fullname', '$child_name', '$email', '$password', 'accepted')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
