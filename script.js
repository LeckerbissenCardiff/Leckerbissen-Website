async function fetchPosts() {
    try {
        const corsProxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://leckerbissencardiff.wordpress.com/feed'; // Increase post count
        
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
            let imageUrl = item.thumbnail;
            
            if (!imageUrl) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const imgTag = tempDiv.querySelector('img');
                imageUrl = imgTag ? imgTag.src : 'placeholder.jpg'; // Extract first image from content
            }
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const pdfLink = tempDiv.querySelector('a[href$=".pdf"]')?.href || '#';
            
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${title}</h2>
                <img src="${imageUrl}" alt="Post image" loading="lazy">
                <a href="${pdfLink}" target="_blank">Download PDF</a>
            `;
            
            container.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchPosts);
