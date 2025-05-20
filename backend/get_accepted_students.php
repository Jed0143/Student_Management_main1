<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root"; 
$password = ""; 
$database = "student_management"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// SQL query to fetch accepted students' name, email, and schedule
$sql = "SELECT id, full_name, email, schedule, gender, birthday, age, first_language, second_language, address, guardian, guardian_contact, guardian_relationship, father_name, father_work, father_contact, mother_name, mother_work,  mother_contact, emergency_contact, emergency_name, teacher_name, school_year_start FROM pre_enrollment WHERE status = 'accepted'";
$result = $conn->query($sql);


if (!$result) {
    echo json_encode(["error" => "SQL Error: " . $conn->error]);
    exit();
}

$students = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students);
$conn->close();
?>
