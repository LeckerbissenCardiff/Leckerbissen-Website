// Updated script.js with RSS to JSON API for reliable fetching

document.addEventListener('DOMContentLoaded', function () {
    const feedUrl = 'https://leckerbissencardiff.wordpress.com/feed/';
    const rssToJsonApi = 'https://api.rss2json.com/v1/api.json?rss_url=';

    function fetchPosts() {
        fetch(`${rssToJsonApi}${encodeURIComponent(feedUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.items || data.items.length === 0) {
                    throw new Error('No posts found in the feed');
                }
                displayPosts(data.items);
            })
            .catch(error => {
                console.error('Error loading feed:', error);
                document.querySelector('#post-container').innerHTML = '<p>Error loading posts. Please try again later.</p>';
            });
    }

    function displayPosts(items) {
        const postContainer = document.querySelector('#post-container');
        postContainer.innerHTML = '';

        items.forEach(item => {
            const title = item.title;
            const link = item.link;
            const pdfUrl = extractPdfUrl(item.description) || link;
            const imageUrl = item.thumbnail || 'default.jpg';

            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <a href="${pdfUrl}" target="_blank">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" alt="${title}">
                        <div class="hover-text">${title}</div>
                    </div>
                </a>
            `;
            postContainer.appendChild(postElement);
        });
    }

    function extractPdfUrl(description) {
        const pdfRegex = /https?:\/\/.*?\.pdf/;
        const match = description.match(pdfRegex);
        return match ? match[0] : null;
    }

    fetchPosts();
});
