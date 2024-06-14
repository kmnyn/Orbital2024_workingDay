document.addEventListener('DOMContentLoaded', function() {
    const nicknameForm = document.getElementById('nicknameForm');

    nicknameForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nickname = document.getElementById('nickname').value;

        // Dynamically construct the login URL based on BASE_URL and username
        const nicknameUrl = BASE_URL + "/editNickname/" + username;

        fetch(nicknameUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname: nickname })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Nickname updated successfully!');
            } else {
                alert('Failed to update nickname. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});