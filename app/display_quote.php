<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

function getDayOfYear() {
    return (int)date('z') + 1; // Day of the year (1-365)
}

function getQuoteIndex($dayOfYear, $sizeOfList) {
    return ($dayOfYear - 1) % $sizeOfList;
}

// Correct path to the quotes file
$quotesFile = __DIR__ . '/../data/quotes.json';

if (!file_exists($quotesFile)) {
    die('Quotes file not found.');
}

$quotesData = json_decode(file_get_contents($quotesFile), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die('Error decoding JSON: ' . json_last_error_msg());
}

$quotes = $quotesData['quotes'] ?? [];

if (!is_array($quotes)) {
    die('Quotes data is not an array.');
}

$sizeOfList = count($quotes);
$dayOfYear = getDayOfYear();
$quoteIndex = getQuoteIndex($dayOfYear, $sizeOfList);

if (!isset($quotes[$quoteIndex])) {
    die('Quote not found.');
}

$quote = $quotes[$quoteIndex];

echo '<blockquote>';
echo '<p>' . htmlspecialchars($quote['quote']) . '</p>';
echo '<p>' . htmlspecialchars($quote['author']) . '</p>';
echo '</blockquote>';
?>
