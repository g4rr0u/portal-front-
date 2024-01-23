<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$uploadDirectory = 'media/';
$maxFileSize = 10 * 1024 * 1024;
$allowedFormats = ['image/jpeg', 'image/png', 'image/bmp'];

$host = "localhost";
$db_name = "portal";
$username = "root";
$password = "";

$mysqli = new mysqli($host, $username, $password, $db_name);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['fileInput'])) {
        $file = $_FILES['fileInput'];

        if (!in_array($file['type'], $allowedFormats)) {
            echo json_encode(['error' => 'Недопустимый формат файла.']);
            exit;
        }

        if ($file['size'] > $maxFileSize) {
            echo json_encode(['error' => 'Превышен максимальный размер файла.']);
            exit;
        }
        $uniqueFileName = uniqid() . '_' . $file['name'];
        $uploadPath = $uploadDirectory . '/' . $uniqueFileName;
       
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $user_id = $_POST['user_id'];
            $requestName = $_POST['requestName'];
            $category = $_POST['requestCategory'];
            $description = $_POST['requestDescription'];
        
            $insertQuery = "INSERT INTO requests (user_id, title, description, category, photo_path) VALUES (?, ?, ?, ?, ?)";
            $stmt = $mysqli->prepare($insertQuery);
            $pathToPhoto = 'php/media/' . $uniqueFileName;
            $stmt->bind_param("issss", $user_id, $requestName, $description, $category, $pathToPhoto);
        
            $stmt->execute();
            
            $newRequestId = $stmt->insert_id;

            $stmt->close();
        
            echo json_encode(['success' => true, 'filename' => $uniqueFileName, 'requestId' => $newRequestId]);
        } else {
            echo json_encode(['error' => 'Ошибка при сохранении файла.']);
        }
    } else {
        echo json_encode(['error' => 'Файл не был передан.']);
    }
} else {
    echo json_encode(['error' => 'Недопустимый метод запроса.']);
}

$mysqli->close();
?>
