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
    if (isset($_POST['requestId']) && isset($_POST['newStatus'])) {
        $requestId = $_POST['requestId'];
        $newStatus = $_POST['newStatus'];

        $updateQuery = "UPDATE requests SET status = ? WHERE request_id = ?";
        $stmt = $mysqli->prepare($updateQuery);

        if (!$stmt) {
            echo json_encode(['error' => 'Ошибка при подготовке запроса: ' . $mysqli->error]);
            exit();
        }

        $stmt->bind_param("si", $newStatus, $requestId);

        if ($stmt->execute()) {
            echo json_encode(['status' => 200]);
        } else {
            echo json_encode(['error' => 'Ошибка при выполнении запроса: ' . $stmt->error]);
        }

        $stmt->close();
        $mysqli->close();
    } else {
        echo json_encode(['error' => 'Недостаточно параметров запроса.']);
    }
}

?>