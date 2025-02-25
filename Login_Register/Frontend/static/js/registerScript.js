document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Dynamically construct the URL based on BASE_URL
        const RegisterUrl = BASE_URL + "/register";

        fetch(RegisterUrl, {  // Use the dynamically constructed RegisterUrl
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
            form.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Registration failed.');
        });
    });
});