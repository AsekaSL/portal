document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.vertical-nav li');
    const contentArea = document.getElementById('content-area');

    // Optional: load default content (e.g., student.html) on page load
    function loadContent(key) {
        const fileName = `${key}.html`;

        fetch(fileName)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(html => {
                contentArea.innerHTML = html;
            })
            .catch(error => {
                contentArea.innerHTML = `<p style="color:red;">Could not load content: ${error.message}</p>`;
            });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            navItems.forEach(i => i.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');

            // Load content
            const key = item.getAttribute('data-content');
            loadContent(key);
        });
    });

    // Load initial content and set first nav item active
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
        loadContent(navItems[0].getAttribute('data-content'));
    }
});
