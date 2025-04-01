async function fetchPosts() {
    try {
        const response = await fetch('https://leckerbissencardiff.wordpress.com/feed/');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        
        const items = xml.querySelectorAll('item');
        const container = document.getElementById('post-container');
        container.innerHTML = '';
        
        items.forEach(item => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const contentEncoded = item.querySelector('content\:encoded')?.textContent || '';
            
            // Extract the first image from content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentEncoded;
            const imgElement = tempDiv.querySelector('img');
            const imageUrl = imgElement ? imgElement.src : 'placeholder.jpg';
            
            const postElement = document.createElement('div');
            postElement.className = 'post';
            
            postElement.innerHTML = `
                <a href="${link}" target="_blank">
                    <img src="${imageUrl}" alt="${title}">
                    <div class="post-title">${title}</div>
                </a>
            `;

            container.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Initial load when page is accessed
fetchPosts();
