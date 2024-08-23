<?php
// fetch_username.php
session_start();

$response = [
    'loggedIn' => false,
    'username' => null
];

if (isset($_SESSION['username'])) {
    $response['loggedIn'] = true;
    $response['username'] = htmlspecialchars($_SESSION['username']);
}

echo json_encode($response);
?>
