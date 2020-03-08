const {Article} = require("../../model/article");
const pagination = require("mongoose-sex-page");
module.exports =  async(req, res) => {
    // 标示当前访问的是用户管理页面
    req.app.locals.currentLink = "article";
    const page = req.query.page;
    let articles = await pagination(Article).find({}).page(page).size(2).display(3).populate("author").exec();
    // res.send(articles);
    res.render("admin/article", {
        articles
    });
}