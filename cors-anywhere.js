// cors-anywhere.js
const corsAnywhere = require('cors-anywhere');

const host = '0.0.0.0';
const port = 8080;

corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeaders: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
}).listen(port, host, () => {
    console.log(`CORS Anywhere server is running on ${host}:${port}`);
});
