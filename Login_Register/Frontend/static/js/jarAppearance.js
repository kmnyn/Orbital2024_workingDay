document.addEventListener('DOMContentLoaded', function () {
    const labels = document.querySelectorAll('.jar-designs label img');
    labels.forEach(img => {
        img.addEventListener('click', function () {
            const radio = this.parentElement.nextElementSibling.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });
});