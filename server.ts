import express from 'express';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3001;

// @ts-ignore
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        // @ts-ignore
        const response = await fetch(targetUrl);
        let html = await response.text();
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('text/html')) {
            const $ = cheerio.load(html);
            // @ts-ignore
            const baseUrl = new URL(targetUrl).origin;

            if ($('base').length === 0) {
                $('head').prepend(`<base href="${baseUrl}/">`);
            }

            html = $.html();
            res.set('Content-Type', 'text/html');
        } else if (contentType && contentType.includes('text/css')) {
            res.set('Content-Type', 'text/css');
        } else if (contentType && contentType.includes('application/javascript')) {
            res.set('Content-Type', 'application/javascript');
        }
        res.send(html);
    } catch (error: any) {
        res.status(500).send(error.toString());
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
