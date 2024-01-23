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

$name = $_POST['name'];
$surname = $_POST['surname'];
$patronimyc = $_POST['patronimyc'];
$login = $_POST['login'];
$email = $_POST['email'];
$password = $_POST['password'];

$sql_check = "SELECT * FROM users WHERE login = ? OR email = ?";
$stmt_check = $mysqli->prepare($sql_check);
$stmt_check->bind_param("ss", $login, $email);
$stmt_check->execute();

$result = $stmt_check->get_result();

if($result->num_rows > 0) {
    $response = array('success' => false, 'error' => 'Login or Email Exist');
} else {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $user_role = 1;

    $sql_insert = "INSERT INTO users (role, surname, name, patronimyc, login, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt_insert =$mysqli->prepare($sql_insert);

    if($stmt_insert) {
        $stmt_insert->bind_param("issssss", $user_role, $surname, $name, $patronimyc, $login, $email, $hashed_password);
        $stmt_insert->execute();

        if($stmt_insert->affected_rows > 0) {
            $response = array('success' => true, 'login' => $login,);
        } else {
            $response = array('success' => false, 'error' => "Error inserting data");
        }
        
        $stmt_insert->close();
    } else {
        $response = array('success' => false, 'error' => "Error preparing statement");
    }
}

$stmt_check->close();
$mysqli->close();

header('Content-Type: application/json');
echo json_encode($response);
die();
?>
