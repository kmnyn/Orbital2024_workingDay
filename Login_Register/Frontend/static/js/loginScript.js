document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Dynamically construct the URL based on BASE_URL
        const loginUrl = BASE_URL + "/login";

        fetch(loginUrl, {  // Use the dynamically constructed loginUrl
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
            if (data.message === 'Login successfully!') {
                window.location.href = data.redirect;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Login failed.');
        });
    });
});