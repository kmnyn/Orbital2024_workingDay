document.addEventListener('DOMContentLoaded', () => {
    const jarList = document.getElementById('jar-list');

    const toggleExpandCollapse = (jarId, shouldExpand) => {
        const jarElement = document.getElementById(`jar-${jarId}`);
        const expandButton = jarElement.querySelector('.expand-button');
        
        if (shouldExpand) {
            jarElement.classList.remove('collapsed');
            jarElement.classList.add('expanded');
            expandButton.textContent = 'Show Less';
        } else {
            jarElement.classList.remove('expanded');
            jarElement.classList.add('collapsed');
            expandButton.textContent = 'Show More';
        }
    };

    jarList.addEventListener('click', (event) => {
        if (event.target.classList.contains('expand-button')) {
            const jarId = event.target.getAttribute('data-jar-id');
            const jarElement = document.getElementById(`jar-${jarId}`);
            
            if (jarElement.classList.contains('collapsed')) {
                toggleExpandCollapse(jarId, true);
            } else {
                toggleExpandCollapse(jarId, false);
            }
        }
    });

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

    window.addEventListener('resize', checkContentHeight);
    checkContentHeight(); // Initial check to set the state of the expand buttons
});
