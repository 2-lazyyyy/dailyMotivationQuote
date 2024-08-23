<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$index = isset($_GET['index']) ? intval($_GET['index']) : 0;

function getQuotes() {
    $quotesFile = __DIR__ . '/../data/quotes.json';
    if (!file_exists($quotesFile)) {
        die(json_encode(['error' => 'Quotes file not found.']));
    }
    $quotesData = json_decode(file_get_contents($quotesFile), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        die(json_encode(['error' => 'Error decoding JSON: ' . json_last_error_msg()]));
    }
    return $quotesData['quotes'] ?? [];
}

$quotes = getQuotes();
$sizeOfList = count($quotes);

if ($index < 0 || $index >= $sizeOfList) {
    die(json_encode(['error' => 'Index out of range.']));
}

$quote = $quotes[$index];

echo json_encode([
    'quote' => htmlspecialchars($quote['quote']),
    'author' => htmlspecialchars($quote['author'])
]);
?>
