<?php
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
  echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
  exit;
}

// Example
$name = $input["name"];
$email = $input["email"];
// Save to DB or whatever

echo json_encode(["status" => "success", "message" => "Teacher saved"]);