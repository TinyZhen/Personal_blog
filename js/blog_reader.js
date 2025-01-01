document.addEventListener("DOMContentLoaded", function () {
    const blogContainer = document.querySelector('main'); // Target main section of blog.html
    const wixFeed = 'https://api.rss2json.com/v1/api.json?rss_url=https://cnzhenlu.wixsite.com/tinybaozi/blog-feed.xml';
    const wordpressFeed = 'https://api.rss2json.com/v1/api.json?rss_url=https://tinybaozicom.wordpress.com/feed/';

    // Function to fetch and render RSS feed
    function fetchAndRenderFeed(feedUrl, showOnlyTitle = false) {
        fetch(feedUrl)
            .then(response => response.json())
            .then(data => {
                data.items.forEach(item => {
                    const article = document.createElement('article');
                    if (showOnlyTitle) {
                        // Display only the title for Wix feed
                        article.innerHTML = `<h2><a href="${item.link}" target="_blank">${item.title}</a></h2>`;
                    } else {
                        // Display title and description for WordPress feed
                        article.innerHTML = `
                            <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
                            <p>${item.description}</p>
                        `;
                    }
                    blogContainer.appendChild(article);
                });
            })
            .catch(error => {
                console.error(`Error fetching feed ${feedUrl}:`, error);
            });
    }
    fetchAndRenderFeed(wordpressFeed, false);
    fetchAndRenderFeed(wixFeed, true);

});
