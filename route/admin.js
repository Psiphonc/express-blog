const express = require("express");

// 创建后台管理页面
const admin = express.Router();
// 绑定二级路由
admin.get("/login", require("./admin/loginPage"));
admin.post("/login", require("./admin/login"));
admin.get("/user", require("./admin/userPage"));
admin.get("/logout", require("./admin/logout"));
admin.get("/user-edit", require("./admin/userEdit").get);
admin.post("/user-add", require("./admin/userEdit").post);
admin.post("/user-modify", require("./admin/userModify"));
admin.get("/remove", require("./admin/userRemove"));
admin.get("/article", require("./admin/article"));
admin.get("/article-edit", require("./admin/articleEdit"));
admin.post("/article-add", require("./admin/articleAdd"));
module.exports = admin;
