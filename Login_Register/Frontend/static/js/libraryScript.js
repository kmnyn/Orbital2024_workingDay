document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jarId = this.getAttribute('data-jar-id');

            // Show confirmation dialog
            const confirmed = confirm("Are you sure you want to delete this jar?");
            
            if (confirmed) {
                fetch(`/deleteJar/${jarId}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.parentElement.remove();
                    } else {
                        alert('Failed to delete jar. Please try again.');
                    }
                });
            }
        });
    });
});