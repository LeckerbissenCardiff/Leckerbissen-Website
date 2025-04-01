document.addEventListener('DOMContentLoaded', function () {
    const feedUrl = 'https://leckerbissencardiff.wordpress.com/feed/';
    const corsProxy = 'https://thingproxy.freeboard.io/fetch/'; // Using more stable proxy

    function fetchPosts() {
        fetch(`${corsProxy}${encodeURIComponent(feedUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, 'application/xml');
                if (!xml.querySelector('item')) {
                    throw new Error('No posts found in the feed');
                }
                displayPosts(xml);
            })
            .catch(error => {
                console.error('Error loading feed:', error);
                document.querySelector('#post-container').innerHTML = '<p>Error loading posts. Please try again later.</p>';
            });
    }

    function displayPosts(xml) {
        const items = xml.querySelectorAll('item');
        const postContainer = document.querySelector('#post-container');
        postContainer.innerHTML = '';

        items.forEach(item => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const enclosure = item.querySelector('enclosure');
            const pdfUrl = enclosure ? enclosure.getAttribute('url') : link;
            const imageUrl = extractImageFromDescription(item.querySelector('description').textContent);

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

    function extractImageFromDescription(description) {
        const imgRegex = /<img[^>]+src="([^"]+)"/;
        const match = description.match(imgRegex);
        return match ? match[1] : 'default.jpg'; // Use default if no image found
    }

    fetchPosts();
});
