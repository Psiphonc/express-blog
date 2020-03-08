module.exports = (req, res, next) => {
    if(req.url != "/login" && !req.session.username) {
        res.redirect("/admin/login");
    } else {
        if(req.session.role === "user"){
            console.log("登陆拦截");
            res.redirect("/home/")
            return ;
        }
        next();
    }
};