document.addEventListener("DOMContentLoaded", function() {
    const capsuleContent = document.getElementById('capsule-content');
    const upcomingDates = document.getElementById('upcoming-dates');
    
    // Dynamically construct the login URL based on BASE_URL and username
    const capsuleLibraryUrl = BASE_URL + "/capsuleLibrary/" + username;

    fetch(capsuleLibraryUrl)
        .then(response => response.json())
        .then(data => {
            const today = new Date().toISOString().split('T')[0];
            let upcoming = '';

            data.forEach(capsule => {
                if (capsule.date === today) {
                    capsuleContent.innerText = capsule.content;
                } else if (new Date(capsule.date) > new Date(today)) {
                    upcoming += `<div>${capsule.date}</div>`;
                }
            });

            if (upcoming) {
                upcomingDates.innerHTML = upcoming;
            } else {
                upcomingDates.innerText = 'No upcoming capsules';
            }
        })
        .catch(error => {
            console.error('Error fetching capsules:', error);
        });
});