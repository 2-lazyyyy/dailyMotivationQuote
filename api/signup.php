<?php
require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO user (username, password) VALUES (:username, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);

        if ($stmt->execute()) {
            echo "Signup successful";
        } else {
            echo "Error: Could not execute the query.";
        }
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Unique constraint violation
            echo "Username already taken";
        } else {
            echo "Error: " . $e->getMessage();
        }
    }
}
?>
