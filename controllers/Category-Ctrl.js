const Category = require('../models/model-category')



const CategoryCrt = {

     AddCategory : async(req, res, next) =>{
        const category = new Category({
            catName: req.body.catName,
        });
        try {
          const newCategory = await category.save();
          res.status(201).send(newCategory);
        } catch (error) {
          res.status(400).send({ message: error.message });
        }
      },

   // --------- fetch All Products---------//
     AllCategoryt :  async(req, res)=>{
    
      Category.find((err, categorys)=>{
          if(err || !categorys){
              return res.json({error: 'No data'})
          }
          res.json({categorys})
      })
    
}

}




module.exports = CategoryCrt