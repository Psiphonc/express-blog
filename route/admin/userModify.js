const {User} = require("../../model/user");
const bcrypt =  require("bcrypt");
module.exports = async (req, res, next) => {
    const modifyObj =  req.body;
    const id = req.query.id;
    // res.send(modifyObj.password);
    let user = await User.findOne({_id: id});
    // res.send(user);
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(isMatch) {
        await User.updateOne({_id: id}, {
            username: modifyObj.username,
            email: modifyObj.email,
            role: modifyObj.role,
            state: modifyObj.state
        })
        // 重定向页面到用户列表
        res.redirect("/admin/user");
    } else {
        let errObj = {path: "/admin/user-edit", message: "密码错误", id}
        next(JSON.stringify(errObj));
    }
}