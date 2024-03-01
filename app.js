const express = require('express');
const axios = require('axios');
const cache = require('node-cache');
const compression = require('compression');

const app = express();
const myCache = new cache({ stdTTL: 3600 });

// App settings
app.use(express.static('public'));
app.use(compression());
app.set('view engine', 'ejs');

// App GET request response
app.get('/', async (req, res) => {
    const latitude = req.query.latitude_input;
    const longitude = req.query.longitude_input;
    const cacheKey = `${latitude}-${longitude}`;

    try {
        // Check if longitude & latitude were set, then check if the data coresponding with said coordinates are saved in cache
        // Saved in cache ? yes: load from cache, no: load from api and save to cache
        let response = null
        if (latitude && longitude) {
            if (!myCache.get(cacheKey)){
                // Load data from API
                response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,showers,snowfall,surface_pressure&forecast_days=1`);
                response = response.data

                // Save data to cache
                myCache.set(cacheKey, response, 3600);
            }
            else response = myCache.get(`${latitude}-${longitude}`);
        }
        res.render('index', { data : response });
    } catch (error) {
        // Send error to client
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/robots.txt', (req, res) => {
    const allow = ['/public/']; // Define paths to allow (optional)

    let robotsTxtContent = 'User-agent: *\n';

    for (const path of disallow) {
        robotsTxtContent += `Disallow: ${path}\n`;
    }
    for (const path of allow) {
        robotsTxtContent += `Allow: ${path}\n`;
    }

    res.type('text/plain');
    res.send(robotsTxtContent);
});

// Run server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});