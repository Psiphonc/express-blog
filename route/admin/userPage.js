const {User} = require("../../model/user");

module.exports = async (req, res) => {
    // 接收客户端传递过来的当前页码参数
    let page = req.query.page || 1;
    let pageSize = 10; // 每页的文档数
    let count = await User.countDocuments({}); // 总文档数
    let total = Math.ceil(count / pageSize); //总页数
    // 标示当前访问的是用户管理页面
    req.app.locals.currentLink = "user";
    let start = (page - 1) * pageSize; //从哪条记录开始查询
    let users = await User.find({}).limit(pageSize).skip(start)
    // res.send(users);
    // console.log(count);
    res.render("admin/user", {
        users,
        page,
        total,
        count
    });
};