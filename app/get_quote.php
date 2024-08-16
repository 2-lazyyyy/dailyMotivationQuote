<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$index = isset($_GET['index']) ? intval($_GET['index']) : 0;

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
$sizeOfList = count($quotes);

if ($index < 0 || $index >= $sizeOfList) {
    die('Index out of range.');
}

$quote = $quotes[$index];

echo '<blockquote>';
echo '<p>' . htmlspecialchars($quote['quote']) . '</p>';
echo '<p>' . htmlspecialchars($quote['author']) . '</p>';
echo '</blockquote>';
?>
