<?php
// Function to establish the database connection
function getDBConnection() {
    // Define connection details within the function
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "mpcar";

    // Create a new MySQLi connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check for connection errors
    if ($conn->connect_error) {
        // Log error details to a file (for debugging only)
        error_log("Database connection failed: " . $conn->connect_error);

        // Return a proper JSON response with a generic error message
        header("Content-Type: application/json");
        echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
        exit;
    }

    return $conn;
}
?>