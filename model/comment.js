const mongoose = require("mongoose");
const Comment = mongoose.model("Comment", new mongoose.Schema({
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    time: {
        type: Date
    }, 
    content: {
        type: String
    }
}));
module.exports = {Comment};