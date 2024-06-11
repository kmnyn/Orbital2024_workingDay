document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("jarForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());


        // Dynamically construct the login URL based on BASE_URL
        const happinessJarUrl = BASE_URL + "/happinessJar";

        fetch(happinessJarUrl, {  // Use the dynamically constructed loginUrl
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert(data.message); // alert "Create successfully! You can check your jar in Jar Library!"
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to create. Please try again.');
        });
    });
});