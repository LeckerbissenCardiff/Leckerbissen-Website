async function fetchPosts() {
    try {
        const cacheBust = new Date().getTime(); // Add cache-busting timestamp
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://leckerbissencardiff.wordpress.com/feed/&cacheBust=${cacheBust}`;
        const response = await fetch(apiUrl);
        
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
            const imageUrl = item.thumbnail || 'placeholder.jpg';
            
            // Extract the first PDF link from the content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const pdfLinkElement = tempDiv.querySelector('a[href$=".pdf"]');
            const pdfLink = pdfLinkElement ? pdfLinkElement.href : item.link;

            const postElement = document.createElement('div');
            postElement.className = 'post';
            
            postElement.innerHTML = `
                <a href="${pdfLink}" target="_blank">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" alt="${title}">
                        <div class="post-title">${title}</div>
                    </div>
                </a>
            `;

            container.appendChild(postElement);
        });
        console.log('Posts with PDF links fetched and displayed successfully.');
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Initial load when page is accessed
fetchPosts();
