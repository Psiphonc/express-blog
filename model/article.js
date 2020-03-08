const mongoose = require("mongoose");
const Article = mongoose.model("Article", new mongoose.Schema({
    title: {
        type: String, 
        maxlength: 20,
        required: [true, "请填写文章标题"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "请填写作者"]
    },
    publishDate: {
        type: Date,
        default: Date.now
    }, 
    cover: {
        type: String,
        default: null
    },
    content: String
}));
module.exports = {
    Article
}