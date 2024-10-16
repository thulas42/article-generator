const axios = require('axios');
require('dotenv').config();

const UPTIMEROBOT_API_KEY = process.env.UPTIMEROBOT_API_KEY;
const NUM_SITES = 100;
const DOMAIN_PREFIX = 'site';

const addDomainToMonitor = async (domainName) => {
    const uptimeApiUrl = 'https://api.uptimerobot.com/v2/newMonitor';
    try {
        const response = await axios.post(uptimeApiUrl, {
            api_key: UPTIMEROBOT_API_KEY,
            format: 'json',
            type: 1,  // HTTP(S) monitor type
            url: `http://${domainName}`,
            friendly_name: domainName,
        });
        console.log(`Monitoring added for ${domainName}`);
    } catch (error) {
        console.error(`Error adding monitoring for ${domainName}:`, error.response.data);
    }
};

const monitorSites = () => {
    for (let i = 1; i <= NUM_SITES; i++) {
        const domainName = `${DOMAIN_PREFIX}${i}.com`;
        addDomainToMonitor(domainName);
    }
};

monitorSites();
