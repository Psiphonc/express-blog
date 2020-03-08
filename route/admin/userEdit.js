const {User, validateUser} = require("../../model/user");
const bcrypt = require("bcrypt");

let get = async (req, res) => {
    const {message, id} = req.query;
    // 标示当前访问的是用户管理页面
    req.app.locals.currentLink = "user";
    if(id) {
        let user = await User.findOne({_id: id});
        res.render("admin/user-edit",{
            message,
            user,
            link: `/admin/user-modify?id=${id}`,
            button: "修改"
        });
        // console.log(user);

    } else {
        res.render("admin/user-edit",{
            message,
            link: "/admin/user-add",
            button: "添加"
        });
    }
    
};

let post = async (req, res, next) => {
    try {
        await validateUser(req.body);
    } catch (error) {
        // 将错误对象转换成字符串传递给错误处理中间件
        return next(JSON.stringify({path: "/admin/user-edit", message: error.message}));
    }

    const user = await User.findOne({email: req.body.email});
    if(user) {
        // res.redirect(`/admin/user-edit?message=该邮箱已经被注册了`)
        return next(JSON.stringify({path: "/admin/user-edit", message: "该邮箱已经被注册了"}));
    }

    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password,salt);
    req.body.password = pwd;
    await User.create(req.body);
    res.redirect("/admin/user");
}


module.exports = {get,post}