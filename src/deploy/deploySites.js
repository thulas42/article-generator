const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs'); // <-- Add this line to include the fs module
require('dotenv').config();

const NUM_SITES = 10; // Adjust the number of sites as needed
const SITE_PREFIX = 'newsplace';
const NETLIFY_TOKEN = process.env.NETLIFY_AUTH_TOKEN; // Optional: Use if authentication token is required

// Function to deploy a single site
const deploySite = (siteName) => {
    const siteDir = path.join(__dirname, '../sites', siteName);

    try {
        // Check if the directory exists
        if (!fs.existsSync(siteDir)) { // <-- fs used here
            console.error(`Directory for ${siteName} does not exist. Skipping...`);
            return;
        }

        // Use execSync to deploy the site
        const command = NETLIFY_TOKEN
            ? `netlify deploy --prod --dir="${siteDir}" --auth=${NETLIFY_TOKEN}`
            : `netlify deploy --prod --dir="${siteDir}"`;

        console.log(`Deploying ${siteName} from directory: ${siteDir}`);

        // Execute the Netlify deploy command and log output
        const output = execSync(command, { stdio: 'inherit' });

        console.log(`${siteName} deployed successfully.`);
        console.log(output.toString());
    } catch (error) {
        console.error(`Error deploying ${siteName}: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
    }
};

// Function to deploy multiple sites
const deploySites = () => {
    for (let i = 1; i <= NUM_SITES; i++) {
        const siteName = `${SITE_PREFIX}${i}`;
        deploySite(siteName);
    }
};

// Run the deployment
deploySites();
