<?php
session_start();

// Function to check if the user is logged in
function checkSession() {
    if (!isset($_SESSION['user_id'])) {
        // If no session is found, redirect to index.html
        header('Location: ./../index.html');
        exit();
    }
}
?>
