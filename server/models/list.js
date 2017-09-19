const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: String,
    order: Number,
    listId: String,
    creator: String
});

module.exports = mongoose.model('List', ListSchema);