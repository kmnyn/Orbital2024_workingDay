document.addEventListener("DOMContentLoaded", function() {

    // Dynamically construct the URL based on BASE_URL and username
    const getMoodTrendUrl = BASE_URL + "/getMoodTrend/" + username;

    const ctx = document.getElementById('moodChart').getContext('2d');
    const trendTypeSelect = document.getElementById('trend-type');

    let moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Mood Trend',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                pointRadius: 6, 
                pointHoverRadius: 8, 
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'll',
                        displayFormats: {
                            day: 'MMM D'
                        }
                    },
                    adapters: {
                        date: {
                            locale: moment.locale()
                        }
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                },
                y: {
                    type: 'category',
                    labels: ['🥳', '😊', '😐', '😫', '😭', '😡'],
                }
            }
        }
    });

    function fetchMoodTrend(trendType) {
        fetch(`${getMoodTrendUrl}?type=${trendType}`)
            .then(response => response.json())
            .then(data => {
                const labels = data.map(item => item.date);
                const moodData = data.map(item => item.emoji);

                moodChart.data.labels = labels;
                moodChart.data.datasets[0].data = moodData;
                moodChart.update();
            });
    }

    trendTypeSelect.addEventListener('change', () => {
        fetchMoodTrend(trendTypeSelect.value);
    });

    fetchMoodTrend(trendTypeSelect.value);
});