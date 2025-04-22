<?php
// Include your database connection file
include 'db_connection.php';

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Check if ID is provided
if (isset($data['id'])) {
    $id = $data['id'];

    // Prepare the SQL query to delete the enrollee
    $sql = "DELETE FROM enrollees WHERE id = ?";
    
    // Prepare the statement
    if ($stmt = $conn->prepare($sql)) {
        // Bind the ID parameter to the statement
        $stmt->bind_param("i", $id);
        
        // Execute the query
        if ($stmt->execute()) {
            // Return success response
            echo json_encode(["success" => true]);
        } else {
            // Return failure response if the query failed
            echo json_encode(["success" => false, "error" => "Failed to delete enrollee."]);
        }
        $stmt->close();
    } else {
        // Return error if statement preparation failed
        echo json_encode(["success" => false, "error" => "Failed to prepare the query."]);
    }

    // Close the database connection
    $conn->close();
} else {
    // If no ID is provided
    echo json_encode(["success" => false, "error" => "Enrollee ID is required."]);
}
?>
