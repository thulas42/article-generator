const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const NUM_SITES = 10; // Number of sites to generate
const SITE_PREFIX = 'newsplace';
const NEWS_API_KEY = process.env.NEWS_API_KEY; // Your API key from .env

// Function to fetch articles from the API
const fetchArticles = async () => {
    try {
        const response = await axios.get(`https://api.thenewsapi.com/v1/news/top?api_token=${NEWS_API_KEY}&locale=us&limit=5`);
        console.log("Fetched Articles: ", response.data.data); // Log fetched articles for debugging
        return response.data.data; // Assuming articles are in response.data.data
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

// Function to generate the HTML content with articles
const generateHTMLContent = (siteName, articles) => {
    let articlesHTML = '';

    // Log the articles to ensure they are being processed
    console.log(`Generating articles for ${siteName}:`, articles);

    // Loop through articles and generate HTML for each
    articles.forEach((article) => {
        // Log each article being added to the HTML
        console.log(`Adding article to ${siteName}:`, article.title);

        articlesHTML += `
            <article>
                <h2>${article.title}</h2>
                <img src="${article.image_url || 'default-placeholder.jpg'}" alt="${article.title}" />
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </article>
        `;
    });

    // Return the complete HTML content
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${siteName} - Latest News</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <h1>Welcome to ${siteName}</h1>
            <section>
                ${articlesHTML}
            </section>
            <footer>
                <p>&copy; 2024 ${siteName}</p>
            </footer>
        </body>
        </html>
    `;
};

// Function to generate HTML files for all sites
const generateHTMLForSites = async () => {
    const articles = await fetchArticles(); // Fetch latest articles

    for (let i = 1; i <= NUM_SITES; i++) {
        const siteName = `${SITE_PREFIX}${i}`;
        const siteDir = path.join(__dirname, '../sites', siteName);
        const indexPath = path.join(siteDir, 'index.html');

        // Check if the directory exists
        if (!fs.existsSync(siteDir)) {
            console.error(`Directory for ${siteName} does not exist. Creating...`);
            fs.mkdirSync(siteDir, { recursive: true });
        }

        // Delete existing index.html if it exists
        if (fs.existsSync(indexPath)) {
            console.log(`Deleting old index.html for ${siteName}`);
            fs.unlinkSync(indexPath);
        }

        // Generate new HTML content with the articles
        const htmlContent = generateHTMLContent(siteName, articles);

        // Write the new HTML content to index.html
        fs.writeFileSync(indexPath, htmlContent);
        console.log(`${siteName}: New index.html generated with articles.`);
    }
};

// Generate the HTML files for all sites
generateHTMLForSites();
