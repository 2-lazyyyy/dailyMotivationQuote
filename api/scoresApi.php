<?php
// Database connection
require_once 'db_connection.php';

date_default_timezone_set('Asia/Yangon');

// Get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Read the raw POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Check if data was decoded correctly
    if (json_last_error() === JSON_ERROR_NONE) {
        $happiness = isset($data['happiness']) ? floatval($data['happiness']) : null;
        $workload_management = isset($data['workload_management']) ? floatval($data['workload_management']) : null;
        $anxiety = isset($data['anxiety']) ? floatval($data['anxiety']) : null;

        // Check if all required data is present
        if ($happiness !== null && $workload_management !== null && $anxiety !== null) {
            // Validate input values to ensure they are within the accepted range
            if (
                !is_numeric($happiness) || $happiness < 1.0 || $happiness > 5.0 ||
                !is_numeric($workload_management) || $workload_management < 1.0 || $workload_management > 5.0 ||
                !is_numeric($anxiety) || $anxiety < 1.0 || $anxiety > 5.0
            ) {
                echo json_encode(['success' => false, 'message' => 'Scores must be between 1.0 and 5.0.']);
                exit();
            }

            // Ensure that scores have only one digit before and after the decimal
            if (
                !preg_match('/^[1-5](\.[0-9])?$/', $happiness) ||
                !preg_match('/^[1-5](\.[0-9])?$/', $workload_management) ||
                !preg_match('/^[1-5](\.[0-9])?$/', $anxiety)
            ) {
                echo json_encode(['success' => false, 'message' => 'Scores must have at most one decimal place.']);
                exit();
            }

            // Check if the user has already submitted scores for today
            session_start();
            $user_id = $_SESSION['user_id'];
            $date = date('Y-m-d');

            $stmt = $mysqli->prepare("SELECT scores_id FROM wellbeing_scores WHERE user_id = ? AND date = ?");
            $stmt->bind_param('is', $user_id, $date);
            $stmt->execute();
            $stmt->bind_result($score_exists);
            $stmt->fetch();
            $stmt->close();

            if ($score_exists) {
                // Update existing scores for today
                $stmt = $mysqli->prepare("UPDATE wellbeing_scores SET happiness = ?, workload_management = ?, anxiety = ? WHERE user_id = ? AND date = ?");
                $stmt->bind_param('dddis', $happiness, $workload_management, $anxiety, $user_id, $date);
                $stmt->execute();
                $stmt->close();
            } else {
                // Insert new scores
                $stmt = $mysqli->prepare("INSERT INTO wellbeing_scores (user_id, date, happiness, workload_management, anxiety) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param('isddd', $user_id, $date, $happiness, $workload_management, $anxiety);
                $stmt->execute();
                $stmt->close();
            }

            echo json_encode(['success' => true, 'message' => 'Scores submitted successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing required data.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON.']);
    }
} else if ($method === 'GET') {
    // Fetch scores for GET request
    session_start();
    if(!$_SESSION['user_id']){
        header("Location: index.html");
        return;
    }
    $user_id = $_SESSION['user_id'];

    // Fetch the most recent score for the user
    $stmt = $mysqli->prepare("SELECT date, happiness, workload_management, anxiety FROM wellbeing_scores WHERE user_id = ? ORDER BY date DESC LIMIT 1");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $stmt->bind_result($date, $happiness, $workload_management, $anxiety);
    $stmt->fetch();
    $recent_score = ['date' => $date, 'happiness' => $happiness, 'workload_management' => $workload_management, 'anxiety' => $anxiety];
    $stmt->close();

    // Fetch scores from the database for chart
    $stmt = $mysqli->prepare("SELECT date, happiness, workload_management, anxiety FROM wellbeing_scores WHERE user_id = ? ORDER BY date ASC");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $scores = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Calculate advice based on the last 3 readings
    // Calculate advice based on the last 3 readings
    if (count($recent_score) >= 3) {
        $avg = ($recent_score['happiness'] + $recent_score['workload_management'] + $recent_score['anxiety']) / 3;

        if ($avg < 1.5) {
            $advice = "Consider to seek professional assistance because your scores are lower.";
            $status = "lower";
        } else {
            $advice = "Your well-being scores are looking good. Keep up the positive habits!";
            $status = "good";
        }
    } else {
        $advice = "Not enough data to provide advice.";
        $status = "notgiven";
    }

    echo json_encode([
        'recent_score' => $recent_score,
        'scores' => $scores,
        'advice' => $advice,
        'status' => $status
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
