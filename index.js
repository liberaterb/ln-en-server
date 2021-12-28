const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const fs = require('fs')

const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0]
    switch (url) {
        case '/':
            index(req, res);
            break;
        case '/api/jsons':
            jsons(req, res);
            break;
        case '/api/getAllDates':
            getAllDates(req, res);
            break;
        case '/api/getDateIds':
            getDateIds(req, res);
            break;
        case '/api/getDateDataById':
            getDateDataById(req, res);
            break;
    }
});

function index(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
    
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>le-index</title>
    <style>
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
</head>
<body>
<select id="datesSelect"></select>
<select id="idSelect"></select>
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
</table>

<script>

const datesSelect = document.querySelector('#datesSelect')
const idSelect = document.querySelector('#idSelect')

datesSelect.addEventListener('change',(e)=>{
   fetch('/api/getDateIds?date='+e.target.value,{method:'GET'}).then(res=>{
       res.json().then(ids=>{
           ids.forEach(id=>{
               id = id.replace('.json',"")
               let option = document.createElement('option')
                option.text = id
                option.setAttribute('value',id)
                idSelect.appendChild(option)
           })
       })
   })
})
idSelect.addEventListener('change',e=>{
})

fetch('/api/getAllDates',{ method:'GET' }).then(res=>{
    res.json().then(dates=>{
        dates.forEach(date=>{
            let option = document.createElement('option')
            option.text = date
            option.setAttribute('value',date)
            datesSelect.appendChild(option)
        })
    })
})
</script>
</body>
</html>
    
    `);
}

function jsons(req, res) {

}

function getAllDates(req, res) {
    fs.readdir('jsons', (err, files) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(files))
    })
}

function getDateDataById(req, res) {
    const params = getParamsFromUrl(req.url)
    const date = params.date
    const id = params.id

    fs.readFile(`jsons/${date}/${id}.json`, (err, data) => {
        if (err) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'text/plain');
            res.end('错误，未找到文件')
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(data.toString())
    })
}

function getDateIds(req, res) {
    const params = getParamsFromUrl(req.url)
    const date = params.date

    fs.readdir(`jsons/${date}`, (err, data) => {
        if (err) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'text/plain');
            res.end('错误，未找到文件夹')
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data))
    })
}

function getParamsFromUrl(url) {
    return url.split('?')[1].split('&').reduce((pre, param) => {
        let arr = param.split('=')
        pre[arr[0]] = arr[1]
        return pre
    }, {});
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
