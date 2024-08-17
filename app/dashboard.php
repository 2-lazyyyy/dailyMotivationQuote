<?php
session_start();

// Redirect to login if the user is not logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login.html");
    exit();
}

// Database connection
require_once './../api/db_connection.php';

// Get user ID from session
$user_id = $_SESSION['user_id'];

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $happiness = floatval($_POST['happiness']);
    $workload = floatval($_POST['workload']);
    $anxiety = floatval($_POST['anxiety']);
    $date = date('Y-m-d');

    // Validate input values to ensure they are within the accepted range and have only one decimal place
    if (
        !preg_match('/^[1-5](\.[0-9])?$/', $_POST['happiness']) ||
        !preg_match('/^[1-5](\.[0-9])?$/', $_POST['workload']) ||
        !preg_match('/^[1-5](\.[0-9])?$/', $_POST['anxiety'])
    ) {
        echo "Error: Scores must be between 1.0 and 5.0, with only one decimal place.";
        exit();
    }

    // Check if the user has already submitted scores for today
    $stmt = $pdo->prepare("SELECT id FROM wellbeing_scores WHERE user_id = :user_id AND date = :date");
    $stmt->execute(['user_id' => $user_id, 'date' => $date]);
    $score_exists = $stmt->fetchColumn();

    if ($score_exists) {
        // Update existing scores for today
        $stmt = $pdo->prepare("UPDATE wellbeing_scores SET happiness = :happiness, workload = :workload, anxiety = :anxiety WHERE user_id = :user_id AND date = :date");
        $stmt->execute(['happiness' => $happiness, 'workload' => $workload, 'anxiety' => $anxiety, 'user_id' => $user_id, 'date' => $date]);
    } else {
        // Insert new scores
        $stmt = $pdo->prepare("INSERT INTO wellbeing_scores (user_id, date, happiness, workload, anxiety) VALUES (:user_id, :date, :happiness, :workload, :anxiety)");
        $stmt->execute(['user_id' => $user_id, 'date' => $date, 'happiness' => $happiness, 'workload' => $workload, 'anxiety' => $anxiety]);
    }

    echo "Scores submitted successfully!";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <header>
        <h1>Welcome to your Dashboard, <?php echo htmlspecialchars($_SESSION['username']); ?></h1>
        <a href="./chart.php">Chart</a>
    </header>
    <main>
    <form action="dashboard.php" method="POST">
        <label for="happiness">Happiness (1.0-5.0):</label>
        <input type="text" id="happiness" name="happiness" required>

        <label for="workload">Workload Management (1.0-5.0):</label>
        <input type="text" id="workload" name="workload" required>

        <label for="anxiety">Anxiety Level (1.0-5.0):</label>
        <input type="text" id="anxiety" name="anxiety" required>

        <button type="submit">Submit Scores</button>
    </form>
    </main>

    <script>
    document.querySelectorAll('input[type="text"]').forEach(function(input) {
        input.addEventListener('input', function() {
            // Allow only digits, a single decimal point, and restrict to one digit before and one after the decimal
            let value = this.value;

            // Regular expression to match valid input: one digit before the decimal, and one digit after
            const pattern = /^[1-4](\.[0-9]?)?$|^5(\.0?)?$/;

            if (!pattern.test(value)) {
                this.value = value.slice(0, -1);
            }
        });

        input.addEventListener('blur', function() {
            // Ensure the value is exactly in the format X.X and does not exceed 5.0
            const pattern = /^[1-4]\.[0-9]$|^5\.0$/;
            if (!pattern.test(this.value)) {
                this.value = ''; // Clear invalid value
            }
        });
    });
    </script>

</body>
</html>
