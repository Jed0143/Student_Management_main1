<?php
function getDBConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "mpcar";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        header("Content-Type: application/json");
        echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
        exit;
    }

    return $conn;
}
?>
