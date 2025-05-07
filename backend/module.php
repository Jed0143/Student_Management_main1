<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_management";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle GET request (fetch modules)
if ($method === 'GET') {
    $action = $_GET['action'] ?? null;

    if ($action === 'fetch') {
        $sql = "SELECT * FROM modules";
        $result = $conn->query($sql);

        $modules = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $modules[] = $row;
            }
        }
        echo json_encode($modules);
    } else {
        echo json_encode(['message' => 'Invalid action']);
    }
    $conn->close();
    exit;
}

// Handle POST request (add, edit, delete modules)
if ($method === 'POST') {
    $action = $_GET['action'] ?? null;

    if ($action === 'edit') {
        if (isset($_POST['id'], $_POST['price'], $_POST['stocks'])) {
            $id = (int) $_POST['id'];
            $price = (float) $_POST['price'];
            $stocks = (int) $_POST['stocks'];

            $sql = "UPDATE modules SET price = $price, stocks = $stocks WHERE id = $id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['message' => 'Module updated successfully']);
            } else {
                echo json_encode(['message' => 'Error updating module: ' . $conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Missing required parameters']);
        }
        $conn->close();
        exit;
    }

    if ($action === 'delete') {
        if (isset($_POST['id'])) {
            $id = (int) $_POST['id'];

            $sql = "DELETE FROM modules WHERE id = $id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['message' => 'Module deleted successfully']);
            } else {
                echo json_encode(['message' => 'Error deleting module: ' . $conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Missing required parameters']);
        }
        $conn->close();
        exit;
    }

    // Default POST (no action) = ADD module
    if (isset($_POST['name'], $_POST['price'], $_POST['stocks'])) {
        $name = $_POST['name'];
        $price = (float) $_POST['price'];
        $stocks = (int) $_POST['stocks'];

        if ($name && $price > 0 && $stocks >= 0) {
            $sql = "INSERT INTO modules (name, price, stocks) VALUES ('$name', $price, $stocks)";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['message' => 'Module added successfully']);
            } else {
                echo json_encode(['message' => 'Error adding module: ' . $conn->error]);
            }
        } else {
            echo json_encode(['message' => 'Invalid input']);
        }
    } else {
        echo json_encode(['message' => 'Missing required parameters']);
    }

    $conn->close();
    exit;
}
?>
