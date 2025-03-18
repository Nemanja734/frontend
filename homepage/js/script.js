const menu_toggle = document.querySelector('.navbar__mobile-sidebar-toggle');
const sidebar = document.querySelector('.navbar__mobile-sidebar');
const body = document.body;

// Toggle sidebar visibility on button click
menu_toggle.addEventListener('click', () => {
    menu_toggle.classList.toggle('active');
    sidebar.classList.toggle('active');

    // Disable or enable scrolling based on sidebar state
    if (sidebar.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
});

// Close sidebar if clicked outside
document.addEventListener('click', (event) => {
    // Check if the click target is not inside the sidebar or the toggle button
    if (
        !sidebar.contains(event.target) &&
        !menu_toggle.contains(event.target) &&
        sidebar.classList.contains('active')
    ) {
        menu_toggle.classList.remove('active');
        sidebar.classList.remove('active');

        // Enable scrolling when sidebar is closed
        body.style.overflow = '';
    }
});