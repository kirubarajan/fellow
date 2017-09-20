const mongoose = require('mongoose');

// creates card schema

const CardSchema = new mongoose.Schema({
    title: String,
    description: String,
    listId: String,
    creator: String
});

module.exports = mongoose.model('Card', CardSchema);