<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ Your database connection settings
$servername = "localhost"; // or "127.0.0.1"
$username = "root";        // default XAMPP user
$password = "";            // default XAMPP password (usually empty)
$database = "mpcar"; // 🔁 Replace with your DB name

// ✅ Create connection
$conn = new mysqli($servername, $username, $password, $database);

// ✅ Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

try {
    if (!isset($_GET['email'])) {
        throw new Exception("Email parameter is missing.");
    }

    $email = $_GET['email'];

    $query = "SELECT * FROM pre_enrollment WHERE email = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "No data found."]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
