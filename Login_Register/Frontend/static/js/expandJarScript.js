document.addEventListener('DOMContentLoaded', () => {
    const jarList = document.getElementById('jar-list');

    const checkContentHeight = () => {
        const jars = document.querySelectorAll('.jar');
        jars.forEach(jar => {
            const content = jar.querySelector('p');
            const expandButton = jar.querySelector('.expand-button');
            
            if (content.scrollHeight > content.clientHeight) {
                expandButton.style.display = 'block';
            } else {
                expandButton.style.display = 'none';
            }
        });
    };

    checkContentHeight();

    jarList.addEventListener('click', (event) => {
        if (event.target.classList.contains('expand-button')) {
            const jarId = event.target.getAttribute('data-jar-id');
            const jarElement = document.getElementById(`jar-${jarId}`);

            if (jarElement.classList.contains('collapsed')) {
                jarElement.classList.remove('collapsed');
                jarElement.classList.add('expanded');
                event.target.textContent = 'Show Less';
            } else {
                jarElement.classList.remove('expanded');
                jarElement.classList.add('collapsed');
                event.target.textContent = 'Show More';
                checkContentHeight();
            }
        }
    });

    window.addEventListener('resize', checkContentHeight);
});