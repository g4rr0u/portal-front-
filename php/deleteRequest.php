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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $requestId = $_POST['requestId'];
    echo $requestId;
    $deleteQuery = "DELETE FROM requests WHERE request_id = ?";
    $stmt = $mysqli->prepare($deleteQuery);

    if (!$stmt) {
        die('Ошибка при подготовке запроса: ' . $mysqli->error);
    }

    $stmt->bind_param("i", $requestId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Ошибка при выполнении запроса: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}

$mysqli->close();
?>
