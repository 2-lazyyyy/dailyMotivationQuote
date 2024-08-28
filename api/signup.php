<?php
require 'db_connection.php';

header('Content-Type: application/json');

$response = array('status' => 'error', 'message' => '');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        $username = $_POST['username'];
        $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

        // Prepare the SQL statement using mysqli
        $stmt = $mysqli->prepare("INSERT INTO user (username, password) VALUES (?, ?)");

        if ($stmt) {
            $stmt->bind_param('ss', $username, $password);

            if ($stmt->execute()) {
                $response['status'] = 'success';
                $response['message'] = 'Signup successful';
            }

            $stmt->close();
        }
    } catch (mysqli_sql_exception $e) {
        // Check if the error is due to a duplicate entry (unique constraint violation)
        if ($e->getCode() === 1062) {
            $response['status'] = 'failed';
            $response['message'] = 'Username already taken';
        } else {
            $response['status'] = 'failed';
            $response['message'] = 'Error: Could not execute the query. ' . $e->getMessage();
        }
    }
}

// Output the JSON response
echo json_encode($response);
?>
