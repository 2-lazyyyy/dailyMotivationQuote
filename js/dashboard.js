document.addEventListener('DOMContentLoaded', () => {
    // Fetch user scores and display chart and advice on page load
    fetchScores();
    checkSession();

    $('#logoutButton').off('click').on('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
        $.post('/app/logout.php', function(response) {
            if (response === 'Logout successful') {
                window.location.href = 'index.html';
            }
        });
    });

    const checkSession = async () => {
        try {
            const response = await fetch('/api/check_session.php');
            const data = await response.json();
            
            if (data.status === 'expired') {
                window.location.href = '/index.html';
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    };

    // Handle form submission via Fetch API
    $("#scoreForm").submit(async function (event) {
        event.preventDefault(); // Prevent form from submitting the default way

        const formData = new FormData(this);
        const data = {
            happiness: formData.get('happiness'),
            workload: formData.get('workload'),
            anxiety: formData.get('anxiety')
        };

        try {
            const response = await fetch('./api/dashboardApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Display success or error message
            const messageElement = document.getElementById('message');
            if (result.success) {
                messageElement.textContent = result.message;
                messageElement.classList.remove('text-danger');
                messageElement.classList.add('text-success');
            } else {
                messageElement.textContent = result.message;
                messageElement.classList.remove('text-success');
                messageElement.classList.add('text-danger');
            }

            // Refresh the scores, chart, and advice
            fetchScores();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Function to fetch scores and update the UI
    async function fetchScores() {
        try {
            const response = await fetch('./api/dashboardApi.php');
            const data = await response.json();

            // Update the scores table
            const scoresTableBody = document.getElementById('scoresTable');
            if (data.recent_score) {
                scoresTableBody.innerHTML =
                    `       <div class="scores">
                                <h3 class="exp1 w-50">Hapiness</h3>
                                <h3 class="exp2 w-50">${data.recent_score.happiness}</h3>
                            </div>
                            <div class="scores">
                                <h3 class="exp1 w-50">Workload Management</h3>
                                <h3 class="exp2 w-50">${data.recent_score.workload}</h3>
                            </div>
                            <div class="scores">
                                <h3 class="exp1 w-50">Anxiety</h3>
                                <h3 class="exp2 w-50">${data.recent_score.anxiety}</h3>
                            </div>
                    `;

                $('.date').text(data.recent_score.date)

                
                
            }

            // Update the advice section
            const adviceSection = document.getElementById('adviceSection');
            if (data.advice && data.status == 'good') {
                adviceSection.innerHTML =
                    `<div class="adviceGood d-flex align-items-center">
                        <span class="alert-icon">&#9432;</span>
                        <div>${data.advice}</div>
                    </div>`;
            } else if (data.advice && data.status == 'lower') {
                adviceSection.innerHTML =
                    `<div class="adviceLower d-flex align-items-center">
                        <span class="alert-icon">&#9432;</span>
                        <div>${data.advice}</div>
                    </div>`;
            } else {
                adviceSection.innerHTML =
                    `<div class="advice d-flex align-items-center">
                        <span class="alert-icon">&#9432;</span>
                        <div>${data.advice}</div>
                    </div>`;
            }

            // Draw the chart
            if (data.scores) {
                drawChart(data.scores);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to draw the Google Line Chart
    function drawChart(scores) {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(() => {
            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Date');
            data.addColumn('number', 'Happiness');
            data.addColumn('number', 'Workload');
            data.addColumn('number', 'Anxiety');

            // Populate the data table with scores
            scores.forEach(score => {
                data.addRow([score.date, parseFloat(score.happiness), parseFloat(score.workload), parseFloat(score.anxiety)]);
            });

            const options = {
                title: 'Wellbeing Scores Over Time',
                curveType: 'function',
                legend: { position: 'bottom' },
                hAxis: { title: 'Date' },
                vAxis: { title: 'Score', minValue: 1, maxValue: 5 },
                colors: ['#007bff', '#28a745', '#dc3545']
            };

            const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
            chart.draw(data, options);

            $("rect").attr("fill", "#e4fde0");
        });

        
    }


});

