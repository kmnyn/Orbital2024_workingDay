document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('verificationForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const enteredOTP = document.getElementById('otp').value;
        const errorDiv = document.getElementById('error');

        if (enteredOTP.length !== 6) {
            errorDiv.textContent = 'Please enter a 6-digit OTP.';
            return errorDiv.textContent;
        }

        const data = { otp: enteredOTP };

        // Dynamically construct the OTP verification URL based on BASE_URL
        const verifyUrl = BASE_URL + "/verification";

        fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.message === 'Email verified successfully!') {
                // Redirect to login page or home page upon successful verification
                window.location.href = BASE_URL + "/login";
            } else {
                errorDiv.textContent = data.message;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            errorDiv.textContent = 'OTP verification failed.';
        });
    });
});
