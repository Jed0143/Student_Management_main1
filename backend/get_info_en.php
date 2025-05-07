<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "student_management";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// ✅ Include the password field in SELECT
$sql = "
    SELECT 
        id, 
        full_name, 
        email, 
        password,  -- ✅ Added
        schedule, 
        status, 
        gender, 
        birthday, 
        first_language, 
        second_language, 
        guardian, 
        guardian_contact, 
        guardian_relationship, 
        mother_name, 
        mother_address, 
        mother_work, 
        mother_contact, 
        father_name, 
        father_address, 
        father_work, 
        father_contact, 
        emergency_name, 
        emergency_contact, 
        address
    FROM pre_enrollment 
    WHERE status = 'pending'
";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . $conn->error]);
    exit;
}

$students = [];

while ($row = $result->fetch_assoc()) {
    $students[] = [
        "id" => (int)$row["id"],
        "full_name" => $row["full_name"],
        "email" => $row["email"],
        "password" => $row["password"], // ✅ Add to response
        "schedule" => $row["schedule"],
        "status" => $row["status"],
        "gender" => $row["gender"],
        "birthday" => $row["birthday"],
        "first_language" => $row["first_language"],
        "second_language" => $row["second_language"],
        "guardian" => $row["guardian"],
        "guardian_contact" => $row["guardian_contact"],
        "guardian_relationship" => $row["guardian_relationship"],
        "mother_name" => $row["mother_name"],
        "mother_address" => $row["mother_address"],
        "mother_work" => $row["mother_work"],
        "mother_contact" => $row["mother_contact"],
        "father_name" => $row["father_name"],
        "father_address" => $row["father_address"],
        "father_work" => $row["father_work"],
        "father_contact" => $row["father_contact"],
        "emergency_name" => $row["emergency_name"],
        "emergency_contact" => $row["emergency_contact"],
        "address" => $row["address"]
    ];
}

echo json_encode($students);
$conn->close();
?>
