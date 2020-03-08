const mongoose = require("mongoose");
const log = require("../utils/log");
const bcrypt = require("bcrypt");
const joi = require("joi");
const User = mongoose.model("User", new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        // 保证邮箱地址不重复
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // admin:管理员
    // user：普通用户
    role: {
        type: String,
        required: true
    },
    // 0: 启用
    // 1: 禁用
    state: {
        type: Number,
        default: 0
    }
}));

const createUser = async () => {
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash("abcd1234", salt);
    const user = await User.create({
        username: "psiphonc",
        email: "psiphonc@outlook.com",
        password: pwd, 
        role: "admin",
        state: 0
    });
}
const validateUser = user => {
    const schema = {
        username: joi.string().min(2).max(12).required().error(new Error("用户名不符合验证规则")),
        email: joi.string().email().error(new Error("邮箱格式不符合要求")),
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).error(new Error("密码格式不符合要求")),
        role: joi.string().valid("admin","user").required().error(new Error("角色值非法")),
        state: joi.number().valid(0, 1).error(new Error("状态信息非法"))
    };
    return joi.validate(user, schema);
}
// ES6中如果键值是一样的 只用写一个就行
module.exports = {
    User,
    validateUser
};