const express = require("express");
const log = require("./utils/log");
const app = express();
const home = require("./route/home");
const admin = require("./route/admin");
const pathJoin = require("path").join;
const bodyParser = require("body-parser");
const session = require("express-session");
const loginGuard = require("./middleware/loginGuard");
const dateformat = require("dateformat");
const tempalate = require("art-template");
const morgan = require("morgan");
const config = require("config");
tempalate.defaults.imports.dateformat = dateformat;
// process.env.NODE_ENV = 'development';
if(process.env.NODE_ENV == "development") {
    console.log("开发环境");
    app.use(morgan("dev"));
}

log(config.get("title"));

// 连接数据库
require("./model/connect");
// require("./model/user");

// 使用body-parser模块的urlencoded方法拦截所有请求，并为其中的post请求添加其请求的对象到req.body
app.use(bodyParser.urlencoded({extended: false}));
// 使用express-session模块给所有req加上session属性以在服务器端保存会话信息
app.use(session({
    secret: "secret key", 
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.set("views", pathJoin(__dirname, "views"));
app.set("view engine", "art");
app.engine("art",require("express-art-template"));

// 开放静态资源文件
app.use(express.static(pathJoin(__dirname, "public")));
// 登陆拦截
app.use("/admin", loginGuard);
// 绑定一级路由
app.use("/home", home);
app.use("/admin", admin);
// 错误处理中间件
app.use((error, req, res, next) => {
    const err = JSON.parse(error);
    let param = [];
    for (let attr in err) {
        if(attr != "path") {
            param.push(attr + "=" + err[attr]);
        }
    }
    res.redirect(`${err["path"]}?${param.join("&")}`);
})

app.listen(3000);
log("服务器启动成");