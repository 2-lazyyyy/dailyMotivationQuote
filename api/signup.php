<?php
require 'db_connection.php';

header('Content-Type: application/json');

$response = array('status' => 'error', 'message' => '');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Prepare the SQL statement using mysqli
    $stmt = $mysqli->prepare("INSERT INTO user (username, password) VALUES (?, ?)");

    if ($stmt) {
        $stmt->bind_param('ss', $username, $password);

        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Signup successful';
        } else {
            // Check if the error is due to a duplicate entry (unique constraint violation)
            if ($stmt->errno === 1062) {
                $response['message'] = 'Username already taken';
            } else {
                $response['message'] = 'Error: Could not execute the query. ' . $stmt->error;
            }
        }

        $stmt->close();
    } else {
        $response['message'] = 'Error: Could not prepare the statement. ' . $mysqli->error;
    }
}

// Output the JSON response
echo json_encode($response);
?>
