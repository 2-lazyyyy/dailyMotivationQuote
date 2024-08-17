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

// Fetch scores from the database
$stmt = $pdo->prepare("SELECT date, happiness, workload, anxiety FROM wellbeing_scores WHERE user_id = :user_id ORDER BY date ASC");
$stmt->execute(['user_id' => $user_id]);
$scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wellbeing Scores Chart</title>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
        // Load the Visualization API and the corechart package.
        google.charts.load('current', {'packages':['corechart']});

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Date');
            data.addColumn('number', 'Happiness');
            data.addColumn('number', 'Workload');
            data.addColumn('number', 'Anxiety');

            data.addRows([
                <?php
                foreach ($scores as $score) {
                    echo "['" . $score['date'] . "', " . $score['happiness'] . ", " . $score['workload'] . ", " . $score['anxiety'] . "],";
                }
                ?>
            ]);

            // Set chart options
            var options = {
                title: 'Wellbeing Scores Over Time',
                curveType: 'function',
                legend: { position: 'bottom' },
                hAxis: {
                    title: 'Date'
                },
                vAxis: {
                    title: 'Score',
                    minValue: 1,
                    maxValue: 5
                }
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }
    </script>
</head>
<body>
    <h1>Wellbeing Scores Chart</h1>
    <div id="chart_div" style="width: 100%; height: 500px;"></div>
</body>
</html>
