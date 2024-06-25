document.addEventListener('DOMContentLoaded', function() {

    // Dynamically construct the URL based on BASE_URL and username
    const todayUrl = BASE_URL + "/capsuleLibrary/today/" + username;
    const upcomingUrl = BASE_URL + "/capsuleLibrary/upcoming/" + username;

    fetch(todayUrl)
        .then(response => response.json())
        .then(data => {
            const todayCapsule = document.getElementById('today-capsule');
            if (data.content) {
                todayCapsule.innerHTML = `<p>${data.content}</p>`;
            } else {
                todayCapsule.innerHTML = '<p>No capsule for now.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching today\'s capsule:', error);
            document.getElementById('today-capsule').innerHTML = '<p>Error loading today\'s capsule.</p>';
        });

    fetch(upcomingUrl)
        .then(response => response.json())
        .then(data => {
            const upcomingCapsules = document.getElementById('upcoming-capsules');
            if (data.upcoming_dates && data.upcoming_dates.length > 0) {
                upcomingCapsules.innerHTML = ''; // Clear any previous content
                data.upcoming_dates.forEach(date => {
                    upcomingCapsules.innerHTML += `<p>${date}</p>`;
                });
            } else {
                upcomingCapsules.innerHTML = '<p>No upcoming capsules.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching upcoming capsules:', error);
            document.getElementById('upcoming-capsules').innerHTML = '<p>Error loading upcoming capsules.</p>';
        });
});