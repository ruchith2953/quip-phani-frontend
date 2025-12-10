const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
require('dotenv').config({ path: './server/.env' });

const app = express();
const PORT = process.env.PORT || 3001;

const proxyApiOptions = {
    target: process.env.EXTRACTDATA || "http://135.237.40.183:9091",
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '',
    },
};

app.use('/proxy', createProxyMiddleware(proxyApiOptions));

app.use(express.static(path.join(__dirname, '../client/build')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
