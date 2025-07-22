document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.vertical-nav li');
    const contentArea = document.getElementById('content-area');

    // Load content based on the data-content attribute of the clicked navigation item.
    // This function fetches an HTML file corresponding to the key (e.g., 'attendance' -> 'attendance.html').
    function loadContent(key) {
        const fileName = `pages/professor/${key}.php`; // Constructs the filename, e.g., "attendance.html"

        fetch(fileName)
            .then(response => {
                if (!response.ok) {
                    // Check for HTTP errors (e.g., 404 Not Found)
                    throw new Error(`HTTP error! Status: ${response.status} for ${fileName}`);
                }
                return response.text(); // Get the response body as text
            })
            .then(html => {
                contentArea.innerHTML = html; // Inject the fetched HTML into the content area
            })
            .catch(error => {
                // Display an error message if content loading fails
                contentArea.innerHTML = `<p style="color:red;">Could not load content for "${key}": ${error.message}. Please ensure '${fileName}' exists.</p>`;
                console.error('Error loading content:', error);
            });
    }

    // Attach click event listeners to each navigation item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' class from all navigation items
            navItems.forEach(i => i.classList.remove('active'));
            // Add 'active' class to the clicked item
            item.classList.add('active');

            // Get the 'data-content' attribute value from the clicked item
            const key = item.getAttribute('data-content');
            // Load the corresponding content
            loadContent(key);
        });
    });

    // On initial page load, set the first navigation item as active and load its content.
    if (navItems.length > 0) {
        navItems[0].classList.add('active'); // Set the first item (Attendance Mark) as active
        loadContent(navItems[0].getAttribute('data-content')); // Load its content (attendance.html)
    }
});
