// app.js – loads content dynamically and handles navigation

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navLinks');

    // ---- Mobile toggle ----
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('open');
    });

    // ---- Function to load a section ----
    function loadSection(sectionId) {
        // If no sectionId, default to 'onboarding'
        const id = sectionId || 'onboarding';
        const filePath = `content/${id}.html`;

        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error('Section not found');
                return response.text();
            })
            .then(html => {
                contentArea.innerHTML = html;
                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === id) {
                        link.classList.add('active');
                    }
                });
                // Update URL hash without scrolling
                history.pushState(null, '', `#${id}`);
                // Close mobile nav
                navList.classList.remove('open');
            })
            .catch(error => {
                contentArea.innerHTML = `<p class="error">⚠️ Could not load section. Please try again.</p>`;
                console.error(error);
            });
    }

    // ---- Nav click handler ----
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (section) loadSection(section);
        });
    });

    // ---- Load section based on URL hash on page load ----
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.querySelector(`[data-section="${initialHash}"]`)) {
        loadSection(initialHash);
    } else {
        // Default to onboarding
        loadSection('onboarding');
    }

    // ---- Handle back/forward browser buttons ----
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.querySelector(`[data-section="${hash}"]`)) {
            loadSection(hash);
        }
    });
});
