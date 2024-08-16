<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$query = isset($_GET['query']) ? $_GET['query'] : '';

function getQuotes() {
    $quotesFile = __DIR__ . '/../data/quotes.json';
    if (!file_exists($quotesFile)) {
        die('Quotes file not found.');
    }
    $quotesData = json_decode(file_get_contents($quotesFile), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        die('Error decoding JSON: ' . json_last_error_msg());
    }
    return $quotesData['quotes'] ?? [];
}

$quotes = getQuotes();
$results = array_filter($quotes, function($quote) use ($query) {
    return stripos($quote['quote'], $query) !== false || stripos($quote['author'], $query) !== false;
});

header('Content-Type: application/json');
echo json_encode(array_values($results)); // Ensure results are properly formatted as JSON array
?>
