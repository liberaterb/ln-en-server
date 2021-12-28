const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const {writeFile} = require('fs')

const server = http.createServer((req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(
        `<style>
            table{
                border: 1px solid black;
                border-collapse: collapse;
            }
            
            table tr{
                border: 1px solid black;
            }
            
            table tr th,td{
                border: 1px solid black;
            }
            </style>
            <table>
            <thead>
            <tr>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            </tr>
            </tbody>
            </table>`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
