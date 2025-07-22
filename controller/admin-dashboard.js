document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.vertical-nav li');
    const contentArea = document.getElementById('content-area');

    function loadContent(key) {
        const fileName = `pages/admin/${key}.php`;
        console.log('Loading:', fileName); // Add this line

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
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const key = item.getAttribute('data-content');
            loadContent(key);
        });
    });

    // Default load
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
        loadContent(navItems[0].getAttribute('data-content'));
    }
});
