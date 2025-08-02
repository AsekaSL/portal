document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.vertical-nav li');
  const contentArea = document.getElementById('content-area');

  // Load content based on the data-content attribute of the clicked navigation item.
  // This fetches corresponding student-related PHP pages from the 'pages/student' folder.
  function loadContent(key) {
    const fileName = `pages/student/${key}.php`; // Construct path, e.g., "pages/student/view-attendance.php"

    fetch(fileName)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} for ${fileName}`);
        }
        return response.text();
      })
      .then(html => {
        contentArea.innerHTML = html; // Insert fetched HTML into content area
      })
      .catch(error => {
        contentArea.innerHTML = `<p style="color:red;">Could not load content for "${key}": ${error.message}. Please ensure '${fileName}' exists.</p>`;
        console.error('Error loading content:', error);
      });
  }

  // Attach click event listeners to navigation items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove 'active' class from all items and add to the clicked item
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Load matching content based on data-content attribute
      const key = item.getAttribute('data-content');
      loadContent(key);
    });
  });

  // On initial page load, activate and load content of the first nav item
  if (navItems.length > 0) {
    navItems[0].classList.add('active');
    loadContent(navItems[0].getAttribute('data-content'));
  }
});
