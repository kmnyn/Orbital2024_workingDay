document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Registered Successfully!");
        form.reset();
    });
});