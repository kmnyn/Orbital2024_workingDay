document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("jarForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        /*
        const data = {
        happiness_input: form.querySelector('textarea[name="happiness_input"]').value
       };
        */
    
        // Dynamically construct the login URL based on BASE_URL and username
        const happinessJarUrl = BASE_URL + "/happinessJar/" + username;

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
            if (data.message.includes('Create successfully')) {
                form.reset(); // Reset the form upon successful creation
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to create. Please try again.');
        });
    });
});