
function loadContent(page) {
    const contentArea = document.getElementById('content-area');
    
    switch(page) {
        case 'about':
            contentArea.innerHTML = '<h1>About Us</h1><p>Information about us.</p>';
            break;
        case 'contact':
            contentArea.innerHTML = '<h1>Contact Us</h1><p>How to reach us.</p>';
            break;
        case 'privacy':
            contentArea.innerHTML = '<h1>Privacy Policy</h1><p>Details about our privacy policy.</p>';
            break;
        case 'terms':
            contentArea.innerHTML = '<h1>Terms of Service</h1><p>Our terms and conditions.</p>';
            break;
        default:
            contentArea.innerHTML = '<h1>Welcome</h1><p>Select a tab to see content.</p>';
    }
}
