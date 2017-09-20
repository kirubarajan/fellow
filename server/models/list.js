const mongoose = require('mongoose');

// creates list schema

const ListSchema = new mongoose.Schema({
    title: String,
    order: Number,
    listId: String,
    creator: String
});

module.exports = mongoose.model('List', ListSchema);