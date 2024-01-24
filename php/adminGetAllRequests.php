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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $getAllRequestsQuery = "SELECT * FROM requests";
    $result = $mysqli->query($getAllRequestsQuery);

    if ($result) {
        $requests = []; 
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
        echo json_encode($requests);
    } else {
        echo json_encode(['error' => 'Ошибка при выполнении запроса: ' . $mysqli->error]);
    }
}

$mysqli->close();
?>
