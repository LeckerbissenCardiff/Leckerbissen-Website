async function fetchPosts() {
    const corsProxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const feedUrl = 'https://leckerbissencardiff.wordpress.com/feed/';
    let allItems = [];
    let page = 1;
    let items = [];

    do {
        try {
            const response = await fetch(`${corsProxyUrl}${encodeURIComponent(feedUrl)}&paged=${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            items = data.items || [];
            allItems = allItems.concat(items);
            page++;
        } catch (error) {
            console.error('Error fetching posts:', error);
            break;
        }
    } while (items.length > 0);

    if (allItems.length === 0) {
        console.error('No posts found.');
        return;
    }

    const container = document.getElementById('post-container');
    container.innerHTML = '';

    allItems.forEach(item => {
        const title = item.title;
        const content = item.content;
        const imageUrl = item.thumbnail || 'placeholder.jpg';

        // Extract the first PDF link from the content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const pdfLink = tempDiv.querySelector('a[href$=".pdf"]')?.href || '#';

        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <a href="${pdfLink}" target="_blank">
                <img src="${imageUrl}" alt="Post Thumbnail">
                <h2>${title}</h2>
            </a>
        `;

        container.appendChild(postElement);
    });
}

fetchPosts();
