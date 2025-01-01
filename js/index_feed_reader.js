document.addEventListener("DOMContentLoaded", function () {
    const imageGrid = document.getElementById('image-grid');
    const feedList = document.getElementById('feed-list');
    const viewMoreBtn = document.getElementById('view-more-button'); // Select the View More button

    // RSS Feed URLs
    const wixFeed = 'https://api.rss2json.com/v1/api.json?rss_url=https://cnzhenlu.wixsite.com/tinybaozi/blog-feed.xml';
    const wordpressFeed = 'https://api.rss2json.com/v1/api.json?rss_url=https://tinybaozicom.wordpress.com/feed/';

    // Helper function to extract images from content
    function extractImagesFromContent(content) {
        const regex = /<img[^>]+src="([^">]+)"/g;
        const images = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            images.push(match[1]);
        }
        return images;
    }

    // Helper function to create image elements for the grid
    function createImageElements(images, title, link) {
        images.forEach(imgSrc => {
            const imgElement = document.createElement('img');
            imgElement.src = imgSrc;
            imgElement.alt = title;
            imgElement.title = title;

            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.target = '_blank';
            linkElement.appendChild(imgElement);

            imageGrid.appendChild(linkElement);
        });
    }

    // Fetch images for the Photo Gallery from Wix
    fetch(wixFeed)
        .then(response => response.json())
        .then(data => {
            data.items.forEach(item => {
                const images = item.enclosure?.link
                    ? [item.enclosure.link] // Check if enclosure contains an image
                    : extractImagesFromContent(item.content);

                if (images.length > 0) {
                    createImageElements(images, item.title, item.link);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching Wix RSS feed:', error);
        });

    // Fetch WordPress feed for Latest Blog Posts
    fetch(wordpressFeed)
        .then(response => response.json())
        .then(data => {
            const feedItems = data.items;

            feedItems.slice(0, 3).forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p>${item.description}</p>
                `;
                feedList.appendChild(li);

                // Extract images for the Photo Gallery
                const images = extractImagesFromContent(item.content);
                if (images.length > 0) {
                    createImageElements(images, item.title, item.link);
                }
            });

            // Manage initial image visibility and toggle
            const allImages = imageGrid.querySelectorAll('a');
            const limit = 4; // Number of images to show initially

            // Hide images beyond the limit
            allImages.forEach((image, index) => {
                if (index >= limit) {
                    image.style.display = 'none';
                }
            });

            // Ensure button is functional after images are loaded
            if (viewMoreBtn) {
                viewMoreBtn.addEventListener('click', () => {
                    const isExpanded = viewMoreBtn.getAttribute('data-expanded') === 'true';

                    if (isExpanded) {
                        allImages.forEach((image, index) => {
                            if (index >= limit) {
                                image.style.display = 'none';
                            }
                        });
                        viewMoreBtn.textContent = 'View More';
                    } else {
                        allImages.forEach(image => {
                            image.style.display = 'block';
                        });
                        viewMoreBtn.textContent = 'View Less';
                    }

                    viewMoreBtn.setAttribute('data-expanded', !isExpanded);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching WordPress RSS feed:', error);
        });
});
