<?php
$host = 'localhost';
$dbname = 'hellowellbeing';
$username = 'root';
$password = '';

// Create connection
$mysqli = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($mysqli->connect_error) {
    die('Database connection failed: ' . $mysqli->connect_error);
}

// Set charset
if (!$mysqli->set_charset('utf8')) {
    die('Error loading character set utf8: ' . $mysqli->error);
}
?>
