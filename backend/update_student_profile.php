<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Corrected connection credentials
$host = "localhost";
$username = "root"; 
$password = ""; 
$database = "student_management"; 

// Create the database connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the raw POST data (JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Check if the required fields are present
if (isset($data['email']) && isset($data['full_name']) && isset($data['gender']) && isset($data['birthday']) && isset($data['age'])) {
    // Sanitize inputs
    $email = mysqli_real_escape_string($conn, $data['email']);
    $full_name = mysqli_real_escape_string($conn, $data['full_name']);
    $gender = mysqli_real_escape_string($conn, $data['gender']);
    $birthday = mysqli_real_escape_string($conn, $data['birthday']);
    $age = mysqli_real_escape_string($conn, $data['age']);
    $address = isset($data['address']) ? mysqli_real_escape_string($conn, $data['address']) : '';
    $first_language = isset($data['first_language']) ? mysqli_real_escape_string($conn, $data['first_language']) : '';
    $second_language = isset($data['second_language']) ? mysqli_real_escape_string($conn, $data['second_language']) : '';
    $mother_name = isset($data['mother_name']) ? mysqli_real_escape_string($conn, $data['mother_name']) : '';
    $father_name = isset($data['father_name']) ? mysqli_real_escape_string($conn, $data['father_name']) : '';
    $emergency_name = isset($data['emergency_name']) ? mysqli_real_escape_string($conn, $data['emergency_name']) : '';
    $mother_contact = isset($data['mother_contact']) ? mysqli_real_escape_string($conn, $data['mother_contact']) : '';
    $father_contact = isset($data['father_contact']) ? mysqli_real_escape_string($conn, $data['father_contact']) : '';
    $guardian = isset($data['guardian']) ? mysqli_real_escape_string($conn, $data['guardian']) : '';
    $guardian_contact = isset($data['guardian_contact']) ? mysqli_real_escape_string($conn, $data['guardian_contact']) : '';
    $guardian_relationship = isset($data['guardian_relationship']) ? mysqli_real_escape_string($conn, $data['guardian_relationship']) : '';
    $schedule = isset($data['schedule']) ? mysqli_real_escape_string($conn, $data['schedule']) : '';

    // Debugging: Log the values to see if father_name is being passed correctly
    error_log("Father Name: " . $father_name);

    // Prepare the SQL update query
    $query = "UPDATE pre_enrollment SET
                full_name = '$full_name',
                gender = '$gender',
                birthday = '$birthday',
                age = '$age',
                address = '$address',
                first_language = '$first_language',
                second_language = '$second_language',
                mother_name = '$mother_name',
                father_name = '$father_name',  
                emergency_name = '$emergency_name',
                mother_contact = '$mother_contact',
                father_contact = '$father_contact',
                guardian = '$guardian',
                guardian_contact = '$guardian_contact',
                guardian_relationship = '$guardian_relationship',
                schedule = '$schedule'
              WHERE full_name = '$full_name'"; 
    // Execute the query
    if (mysqli_query($conn, $query)) {
        // Successfully updated
        echo json_encode(['status' => 'success', 'message' => 'Student profile updated successfully']);
    } else {
        // Failed to update
        echo json_encode(['status' => 'error', 'message' => 'Failed to update student profile: ' . mysqli_error($conn)]);
    }

    // Close the database connection
    mysqli_close($conn);
} else {
    // Missing required fields
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
}
?>
