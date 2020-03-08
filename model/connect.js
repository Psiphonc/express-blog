const mongoose = require("mongoose");
const log = require("../utils/log");

mongoose.connect("mongodb://localhost/blog", {useNewUrlParser: true, useUnifiedTopology: true}).
    then(() => {
        log("数据库连接成功");
    }).catch(() => {
        log("数据库连接失败");
    });