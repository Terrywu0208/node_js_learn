// 導入http模塊
const http = require("http");
// 導入file system
const fs = require("fs");
const qs = require("querystring");

const port = 3000;
const ip = "127.0.0.1";

// 接收到網址後回傳對應的網頁html
const sendResponse = (filename, statusCode, response) =>{
    fs.readFile(`./html/${filename}`, (error, data) =>{
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("sorry");
        }else{
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/html");
            response.end(data); //網頁資料html文件
        }
    });
}

// 用http模塊創建node js server 並回傳 hello from node js
const server = http.createServer((request, response) =>{
    console.log(request.url, request.method);
    const method = request.method;
    let url = request.url;
    //get 方式請求 並回傳對應網頁 基礎應用
    if (method === "GET"){
        const requestURL = new URL(url, `http://${ip}:${port}`);
        console.log(requestURL);
        console.log(requestURL.searchParams.get("lang"));
        url = requestURL.pathname;
        //get 取得參數
        const lang = requestURL.searchParams.get("lang");
        //get 取得參數
        let selector;

        if (lang === null || lang === "en") {
            selector = "";
        } else if (lang === "zh"){
            selector = "-zh";
        }else{
            selector = "";
        }

        if (url === "/") {
            sendResponse(`index${selector}.html`,200,response);
        }else if (url === "/about.html") {
            sendResponse(`about${selector}.html`,200,response);
        }else if (url === "/login.html") {
            sendResponse(`login${selector}.html`,200,response);
        }else if (url === "/login-success.html") {
            sendResponse(`login-success${selector}.html`,200,response);
        }else if (url === "/login-fail.html") {
            sendResponse(`login-fail${selector}.html`,200,response);
        }else{
            sendResponse(`404${selector}.html`,404,response);
        }
    }else{
        if (url === "/process-login") {
            let body = [];

            request.on("data",(chunk) => {
                body.push(chunk);
            });

            request.on("end", () =>{
                body = Buffer.concat(body).toString();
                body = qs.parse(body)
                console.log(body);

                if (body.username === "qqq" && body.password === "qqq") {
                    response.statusCode = 301;
                    response.setHeader("Location", "/login-success.html");
                  } else {
                    response.statusCode = 301;
                    response.setHeader("Location", "/login-fail.html");
                }

                response.end();
            })
        }
    }
    //get 方式請求 並回傳對應網頁
});

// 監聽端口3000 從這個端口收集請求
server.listen(port, ip, () => {
    console.log(`server is running at http://${ip}:${port}`);
});
