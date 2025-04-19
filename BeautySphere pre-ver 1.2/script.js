
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown, .dropdown-submenu');

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu, .submenu');

        if (!menu) return;

        dropdown.addEventListener('mouseleave', function() {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            if (menu.classList.contains('dropdown-menu')) {
                menu.style.transform = 'translateY(10px)';
            } else {
                menu.style.transform = 'translateX(10px)';
            }
        });

        dropdown.addEventListener('mouseenter', function() {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            if (menu.classList.contains('dropdown-menu')) {
                menu.style.transform = 'translateY(0)';
            } else {
                menu.style.transform = 'translateX(0)';
            }
        });
    });
});
