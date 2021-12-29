const http = require('http');

const hostname = '127.0.0.1';
const port = 3003;
const fs = require('fs')

Date.prototype.Format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'S+': this.getMilliseconds()
    };
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
        //第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
};

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
<button id="btnAddJson">新增json</button>
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
const btnAddJson = document.querySelector('#btnAddJson')

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

btnAddJson.addEventListener('click',e=>{
    fetch('/api/addNewJsonFile',{method:'GET'}).then(res=>{
        res.text().then(text=>{
            let res = Boolean(text)
            if (res){
                alert('添加成功')
            }else{
                alert('添加失败')
            }
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

const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0]
    switch (url) {
        case '/':
            index(req, res);
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
        case '/api/addNewJsonFile':
            addNewJsonFile(req, res)
    }
});

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

function addNewJsonFile(req, res) {
    let today = new Date().Format('yyyy-MM-dd')
    if (!fs.existsSync(`jsons/${today}`)) fs.mkdirSync(`jsons/${today}`)
    fs.readdir(`jsons/${today}`, (err, files) => {
        let max = 0
        if (files.length > 0) {
            let nums = files.reduce((pre, file) => {
                file = file.replace('.json', '')
                pre.push(Number(file))
                return pre
            }, [])
            max = Math.max(...nums)
        }
        fs.writeFile(`jsons/${today}/${max+1}.json`, '[]',(err)=>{
            res.setHeader('Content-Type','text/plain')
            if (err){
                res.statusCode = 400
                res.end('false')
            }else{
                res.statusCode = 200
                res.end('true')
            }
        })
    })
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
