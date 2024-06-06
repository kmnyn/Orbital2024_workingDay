document.querySelectorAll('.main-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.getElementById(tab.dataset.target);
        document.querySelectorAll('.submenu').forEach(menu => {
            if (menu !== target) {
                menu.style.display = 'none';
            }
        });
        if (target.style.display === 'none' || target.style.display === '') {
            target.style.display = 'flex';
        } else {
            target.style.display = 'none';
        }
    });
});