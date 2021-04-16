const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    catName :{
        type : String,
        required : true,
        index: true
    }

})

const Category = mongoose.model('category',categorySchema);

module.exports = Category