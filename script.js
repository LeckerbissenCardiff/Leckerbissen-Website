async function fetchPosts() {
    try {
        const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://leckerbissencardiff.wordpress.com/feed/';
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
            const link = item.link;
            const imageUrl = item.thumbnail || 'placeholder.jpg';
            
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
        console.log('Posts fetched and displayed successfully.');
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Fetch posts every hour
setInterval(fetchPosts, 60 * 60 * 1000);

// Initial load
fetchPosts();