const {Article} = require("../../model/article");
const pagination = require("mongoose-sex-page");

module.exports = async (req, res) => {
    const page = req.query.page;
    let ret = await pagination(Article).page(page).size(4).display(5).find().populate("author").exec();
    // res.send(ret);
    // console.log(ret.records[1].author.username);
    console.log(ret);
    res.render("home/default", {
        ret: ret
    });
}