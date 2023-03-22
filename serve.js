//
// This script will run a local development server. This is useful when
// developing the theme.
//
// Usage:
// `node serve`
//

const http = require('http');
const fs = require('fs');
const resume = JSON.parse(fs.readFileSync('./assets/json/resume.json', 'utf8'));
const theme = require('./index.js');
const path = require('path');
const { workerData } = require('worker_threads');

const PORT = 8887;

http.createServer(function(req, res) {

    path.join(process.cwd(), 'assets');
    const picture = resume.basics.picture && resume.basics.picture.replace(/^\//, '');

    if (picture && req.url.replace(/^\//, '') === picture.replace(/^.\//, '')) {
        const format = path.extname(picture);
        try {
            const image = fs.readFileSync(picture);
            res.writeHead(200, {
                'Content-Type': `image/${format}`,
            });
            res.end(image, 'binary');
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Picture not found !');
                res.end();
            } else {
                throw error;
            }
        }
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(render());workerData
    }
}).listen(PORT);

console.log(`Preview: http://localhost:${PORT}/`);
console.log('Serving..');

function render() {
    try {
        return theme.render(JSON.parse(JSON.stringify(resume)));
    } catch (e) {
        console.log(e.message);
        return '';
    }
}
