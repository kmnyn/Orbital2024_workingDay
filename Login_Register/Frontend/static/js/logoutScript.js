document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById('logout-button');
    
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        const confirmation = confirm("Are you sure you want to log out?"); // Show confirmation dialogue
        if (confirmation) {
            window.location.href = this.href; // Proceed with the logout
        }
    });
});