<?php
session_start();

header('Content-Type: application/json');

// Check if the user is logged in
if (isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'expired']);
}
?>
