const Users = require('../models/model-User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validation = require('../middleware/validation')

const userCtrl = {
    register: async (req, res) =>{
        try {
            console.log(req.body);
            const { error } = validation.registerValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const {full_name, email, phone, password, address} = req.body

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "The email already exists."})

           
            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                full_name, 
                email, 
                phone,
                address,
                password : passwordHash
            })

            // Save mongodb
            await newUser.save()

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({id: newUser._id})
           
            res.json({'user' : newUser, accesstoken})

        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },

    login: async(req, res) =>{

        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

            // If login success , create access token 
             const accesstoken = createAccessToken({id: user._id})
           
            res.json({user, accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }

    },

    getUser: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not exist."})

            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

//checkout
    checkout : (req, res, next)=>{
    const cartId = req.params.cartId
     const frontURL = 'http://localhost:3000'
  
    Panier.getPanierById(cartId, function (err, c) {
      if (err) return next(err)
      if (!c) {
        let err = new ErrorHandler('/checkout', 400, 'invalid_field', { message: 'cart not found' })
        return next(err)
      }
     
      const items_arr = new panier_function(c).generateArray()
      const paypal_list = []
      for (let i of items_arr) {
         paypal_list.push({
         "name": i.produit.title,
         "price": i.produit.price,
         "currency": "CAD",
         "quantity": i.qty
         })
       }
     const create_payment_json = {
       "intent": "sale",
         "payer": {
           "payment_method": "paypal"
       },
         "redirect_urls": {
           "return_url": frontURL + '/success_page',
           "cancel_url": frontURL + '/cancel_page'
         },
         "transactions": [{
           "item_list": {
             "items": paypal_list
          },
           "amount": {
             "currency": "CAD",
             "total": c.totalPrice
           },
           "description": "This is the payment description."
         }]
       }
      paypal.configure(process.env.PAYPALCONFIG);
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          console.log(JSON.stringify(error));
          return next(error)
        } else {
          console.log(payment);
          for (const link of payment.links) {
            if (link.rel === 'approval_url') {
              res.json(link.href)
            }
          }
        }
      });
    })
  },
  
  //GET /payment/success
   payment: (req, res, next) =>{
    var paymentId = req.query.paymentId;
    var payerId = { payer_id: req.query.PayerID };
    paypal.payment.execute(paymentId, payerId, function (error, payment) {
      if (error) {
        console.error(JSON.stringify(error));
        return next(error)
      } else {
        if (payment.state == 'approved') {
          console.log('payment completed successfully');
          // console.log(payment.transactions[0].item_list);
        for(const item of payment.transactions[0].item_list.items){
              console.log('item');
      Product.findAndUpdate(item.name,item.quantity,function (err, p) {
        if (err) return next(err)
        if (!p) {
          let err = new ErrorHandler('/checkout', 400, 'invalid_product', { message: 'product not found' })
          return next(err)
        }
      })
        }
          res.json({ payment })
        } else {
          console.log('payment not successful');
        }
      }
    })

}


}

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}


module.exports = userCtrl