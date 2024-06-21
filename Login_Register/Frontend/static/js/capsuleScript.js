document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("capsuleForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Dynamically construct the login URL based on BASE_URL and username
        const capsuleUrl = BASE_URL + "/timeCapsule/" + username;

        fetch(capsuleUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert(data.message);
            if (data.success) {
                form.reset();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to create time capsule. Please try again.');
        });
    });
});