async function fetchPosts() {
    try {
        const corsProxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://leckerbissencardiff.wordpress.com/feed/';
        const response = await fetch(corsProxyUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            console.error('No posts found.');
            return;
        }
        
        const container = document.getElementById('post-container');
        container.innerHTML = '';

        data.items.forEach(item => {
            const title = item.title;
            const content = item.content;
            let imageUrl = 'placeholder.jpg'; // There is no 'placeholder.jpg' at the moment

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const imgElement = tempDiv.querySelector('img');
            if (imgElement) {
                imageUrl = imgElement.src;
            }

            const pdfLinkElement = tempDiv.querySelector('a[href$=".pdf"]');
            const pdfLink = pdfLinkElement ? pdfLinkElement.href : item.link;

            const postElement = document.createElement('div');
            postElement.className = 'post';
            
            postElement.innerHTML = `
                <a href="${pdfLink}" target="_blank">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" alt="${title}" />
                        <div class="post-title">${title}</div>
                    </div>
                </a>
            `;

            container.appendChild(postElement);
        });

        console.log('Posts successfully fetched and displayed.');
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchPosts);

document.addEventListener("DOMContentLoaded", function () {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const menuPanel = document.getElementById("menu-panel");

    function toggleMenu() {
        menuPanel.classList.toggle("active");
        hamburgerBtn.classList.toggle("is-active");
    }

    hamburgerBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        toggleMenu();
    });

    document.addEventListener("click", function (event) {
        if (menuPanel.classList.contains("active") && !menuPanel.contains(event.target) && !hamburgerBtn.contains(event.target)) {
            toggleMenu();
        }
    });

    menuPanel.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function() {
             if (menuPanel.classList.contains("active")) {
                toggleMenu();
             }
        });
    });

});

document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");
    const okBtn = document.getElementById("cookie-ok-btn");
    
    if (!localStorage.getItem("cookieConsent")) {
        banner.style.display = "flex";
    }
    
    okBtn.addEventListener("click", function () {
        localStorage.setItem("cookieConsent", "true")
            banner.style.display = "none";
    });
});

// Made by Reef, BA Modern History and German 2019 - 2025
