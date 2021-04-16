const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    name : {
        type : String,
        require : true,
        minlenght : 4,
        maxlength : 150
    },
    price : {
        type : Number,
        require : true,
    },
    description: {
        type: String,
        require : true,
    },
    countInStock: {
        type: Number,
        required: true,
      },
    catName:{
        type: mongoose.Schema.Types.ObjectId,
      require: true
    },
    id_seller : {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },

    img : {
        type : String,
        require : true
    }

},{
    timestaps : true
});


module.exports = mongoose.model('Product', ProductsSchema);