<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$db_name = "portal";
$username = "root";
$password = "";

$mysqli = new mysqli($host, $username, $password, $db_name);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$user_id = $_GET['user_id'];

$selectQuery = "SELECT * FROM requests WHERE user_id = ?";
$stmt = $mysqli->prepare($selectQuery);
$stmt->bind_param("i", $user_id);

$stmt->execute();

$result = $stmt->get_result();
$requests = array();

while ($row = $result->fetch_assoc()) {
    $requests[] = array(
        'request_id' => $row['request_id'],
        'name' => $row['title'],
        'status' => $row['status'], 
        'time' => $row['timestamp'], 
        'category' => $row['category'],
        'description' => $row['description'],
        'pathToPhoto' => $row['photo_path']
    );
}

$stmt->close();

echo json_encode($requests);

$mysqli->close();
?>
