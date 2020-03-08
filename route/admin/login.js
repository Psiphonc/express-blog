const bcrypt = require("bcrypt");
const {User} = require("../../model/user");

module.exports = async (req, res) => {
    const {email,password} = req.body;
    if(email.trim().length === 0) {
        return res.status(400).render("admin/common/error", {msg: "没有输入邮箱"});
    }
    if(password.trim().length === 0) {
        return res.status(400).render("admin/common/error", {msg: "没有输入密码"});
    }
    let user = await User.findOne({email});
    if(user) {
        let isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            req.session.username = user.username;
            // next();
            // 把当前登陆的用户名作为公共属性开放给所有模版
            req.session.role = user.role;
            req.app.locals.userInfo = user;
            if(user.role === "admin"){
                res.redirect("/admin/user");
            } else if(user.role === "user") {
                res.redirect("/home/")
            }
        } else {
            res.status(400).render("admin/common/error", {msg: "用户名或密码不正确"});
        } 
    } else {
        res.status(400).render("admin/common/error", {msg: "用户名或密码不正确"});
    }
};