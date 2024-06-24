document.addEventListener("DOMContentLoaded", function() {
    const capsuleContent = document.getElementById('capsule-content');
    const upcomingDates = document.getElementById('upcoming-dates');

    // debug
    console.log("capsuleContent element:", capsuleContent);
    console.log("upcomingDates element:", upcomingDates);
    
    // Dynamically construct the login URL based on BASE_URL and username
    const capsuleLibraryUrl = BASE_URL + "/capsuleLibrary/" + username;

    fetch(capsuleLibraryUrl)
        .then(response => response.json())
        .then(data => {

            //debug
            console.log("Fetched capsules data:", data);

            const now = new Date();
            let upcoming = '';
            let currentCapsuleContent = '';

            for (let i = 0; i < data.length; i++) {
                const capsule = data[i];
                const capsuleDate = new Date(capsule.scheduled_datetime);

                if (capsuleDate <= now) {
                    // This capsule's time has come or passed
                    currentCapsuleContent = capsule.content;

                    // Check if the next capsule exists
                    const nextCapsule = data[i + 1];
                    if (nextCapsule) {
                        const nextCapsuleDate = new Date(nextCapsule.scheduled_datetime);
                        if (now < nextCapsuleDate) {
                            // Current time is before the next capsule's scheduled time
                            break;
                        }
                    } else {
                        // No mor capsules, display the last one
                        break;
                    }
                } else {
                    // Upcoming capsules
                    upcoming += `<div>${capsuleDate.toISOString().split('T')[0]} ${capsuleDate.toISOString().split('T')[1].substring(0, 5)}</div>`;
                }
            }

            //debug
            console.log("Current capsule content:", currentCapsuleContent);
            console.log("Upcoming capsules:", upcoming);

            if (currentCapsuleContent) {
                capsuleContent.innerText = currentCapsuleContent;
            } else {
                capsuleContent.innerText = 'No capsule to display at the moment';
            }

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