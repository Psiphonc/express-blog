const express = require("express");
// 创建博客展示页面路由
const home = express.Router();
// 绑定二级路由
home.get("/", require("./home/index"));
home.get("/article", require("./home/article"));
home.post("/comment", require("./home/comment"))
module.exports = home;
