const Products = require('../models/model-products')
const jwt = require('jsonwebtoken')
var multer = require('multer');
var path = require('path');
var fs = require('fs');
const { response } = require('express');




let folder= path.join(__dirname,'../../frontend/public');

let storage = multer.diskStorage({

    destination: (req, file, cb) => {
      console.log(folder + "and " + cb)
            cb(null, path.join(folder ,'/images/'))
        },
    filename: (req, file, cb) => {

               // cb(null,new Date().toISOString() + file.originalname);
                cb(null, new Date().toISOString().replace(/:/g,'-')+ file.originalname)
            }

  });
  let fileFilter=(req, file, cb)=>{
    if (file.mimetype === "image/jpeg" ||  file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
var upload = multer()
  var upload = multer({
    storage: storage,
     limits: {
        fieldSize: 1024 * 1024 * 5
     },
    fileFilter: fileFilter

});
//Upload Single Image
  const showImageSingle = upload.single('img');

// --------- Add Product---------//
const AddProduct = (req, res) =>{
  console.log(folder + " and 11 ")
  const url = 'http://localhost:3000/';

   const Product = new Products({

        name: req.body.name,
        catName : req.body.catName,
        price: req.body.price,
        description : req.body.description,
        countInStock : req.body.countInStock,
        id_seller : req.body.id_seller,
        img:url + '/images/' + req.file.filename,
    })
    console.log("req.file");
    console.log(req.file);
    Product.save()
    .then(data=>{res.send(data)})
    .catch(err=>{console.log(err)})
}

// --------- fetch All Products---------//
const AllProducts = (req, res)=>{
    
      Products.find((err, products)=>{
          if(err || !products){
              return res.json({error: 'No data'})
          }
          res.json({products})
      })
}


// --------- fetch Product by ID ---------//
const fetchProductById =  async (req,res)=>{
    //  const token = req.header('auth-token')
    //  const id_seller = jwt.verify(token,process.env.ACCESS_TOKEN_SELLER)._id
    let id = req.params.id_seller;
    await Products.find({id_seller:id }).then(product=>{
      res.json({product})
    }).catch(err=>{
      console.log(err);
    })
  }

const getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
  const getProductByCategory =  async (req, res,next) => {
    let {catName} = req.params;
  console.log('query ');
  console.log(catName);
    await Products.find({catName:catName}).then(products=>{
      res.json({products})
    }).catch(err=>{
      res.json({err})
    })
  };





module.exports = {
    AddProduct, AllProducts, getProductById, fetchProductById,showImageSingle,getProductByCategory
}