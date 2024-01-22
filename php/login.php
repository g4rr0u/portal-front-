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

$login = $_POST['login'];
$password = $_POST['password'];

$sql_check = "SELECT * FROM users WHERE login = ?";
$stmt_check = $mysqli->prepare($sql_check);

if($stmt_check) {
    $stmt_check->bind_param("s", $login);
    $stmt_check->execute();
    $result = $stmt_check->get_result();

    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if(password_verify($password, $user['password'])){
            $user_id = $user['id'];
            $role = $user['role'];
            $response = array('succes' => true, 'login' => $login, 'role' => $role);
        } else {
            $response = array('success' => false);
        }
    } else {
        $response = array('success' => false);
    }
    $stmt_check->close();
} else {
    $response = array('success' => false);
}
$mysqli->close();


header('Content-Type: application/json');
echo json_encode($response);
?>
