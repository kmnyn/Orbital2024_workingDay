document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('verificationForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const enteredOTP = document.getElementById('otp').value;

        // Ensure OTP is 6 digits
        if (enteredOTP.length !== 6) {
            alert('Please enter a 6-digit OTP.');
            return;
        }

        // Data to be sent in the request
        const data = { otp: enteredOTP };

        // Define BASE_URL if not already defined
        const BASE_URL = BASE_URL || window.location.origin; // Use current origin if BASE_URL is not set

        // Dynamically construct the OTP verification URL
        const verifyUrl = BASE_URL + "/verification";

        // Send POST request to verify OTP
        fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert(data.message);
            if (data.message === 'Email verified successfully!') {
                // Redirect to login page or home page upon successful verification
                window.location.href = BASE_URL + "/login";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('OTP verification failed.');
        });
    });
});
