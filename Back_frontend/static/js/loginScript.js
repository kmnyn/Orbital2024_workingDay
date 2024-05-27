document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        fetch('http://127.0.0.1:5000/login', {
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
                window.location.href = '/';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Login failed.');
        });
    });
});