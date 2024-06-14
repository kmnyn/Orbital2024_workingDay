document.addEventListener('DOMContentLoaded', function() {
    const notificationForm = document.getElementById('notificationForm');

    notificationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const emailNotifications = document.getElementById('emailNotifications');
        const inAppNotifications = document.getElementById('inAppNotifications');

        const formData = new FormData(notificationForm);
        const data = Object.fromEntries(formData.entries());

        if (!emailNotifications.checked) {
            alert('If you successfully turned off email notification, you will not be able to receive your time capsule.');
        }

        if (!inAppNotifications.checked) {
            alert('If you successfully turned off in-app notification, you will not be able to see your happiness jar in app.');
        }

        // Dynamically construct the login URL based on BASE_URL and username
        const notificationUrl = BASE_URL + "/notification/" + username;

        fetch(notificationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_notifications: emailNotifications.checked,
                in_app_notifications: inAppNotifications.checked
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Notification settings updated successfully!');
            } else {
                alert('Failed to update notification settings. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});