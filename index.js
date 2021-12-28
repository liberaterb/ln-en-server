const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const {writeFile} = require('fs/promises')

const server = http.createServer((req, res) => {

    writeFile("temp.txt","temp")

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<div>
        1
        </div>`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
