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

$sql_check = "SELECT * FROM users WHERE login = ?";
$stmt_check = $mysqli->prepare($sql_check);

if($stmt_check) {
    $stmt_check->bind_param("s", $login);
    $stmt_check->execute();
    $result = $stmt_check->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
            $role = $user['role'];
            $surname = $user['surname'];
            $name = $user['name'];
            $patronimyc = $user['patronimyc'];
            $user_id = $user['user_id'];
            $response = array('success' => true, 'login' => $login, 'role' => $role, 'name' => $name, 'surname' => $surname, 'patronimyc' => $patronimyc, 'user_id' => $user_id);
        
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
