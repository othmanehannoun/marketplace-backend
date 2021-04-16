const Seller = require('../models/model-seller')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const validation = require('../middleware/validation')

const sellerCtrl = {
    register: async (req, res) =>{
        try {
            console.log(req.body);
            const { error } = validation.registerSellerValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);

          const {full_name, email, phone, address} = req.body

          const temppassword = randomPassword(10)
          req.body.password  = temppassword
    
            const seller = await Seller.findOne({email})
            if(seller) return res.status(400).json({msg: "The email already exists."})

            // Password Encryption
            const passwordHash = await bcrypt.hash(req.body.password, 10)
            const newSeller = new Seller({
                full_name, 
                email,
                phone,  
                password : passwordHash,
                address
            })

            // Save mongodb
            await newSeller.save()
            // Then create jsonwebtoken to authentication
            
            const accesstoken = createAccessToken({id: newSeller._id})

            // SEND MAIL 
            let transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: process.env.EMAIL,  // TODO: your gmail account
                  pass: process.env.PASSWORD // TODO: your gmail password
              }
          });
          
          // Step 2
          let mailOptions = {
              from: process.env.EMAIL, // TODO: email sender
              to: email, // TODO: email receiver
              subject: 'Temporary password ',
              html:`
                     
                     
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
    
    <tr>
        <td bgcolor="#3CBEB2" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                        <h3 style="font-size: 30px; font-weight: 400; margin: 2;">Temporary password</h1> <img src=" https://img.icons8.com/clouds/100/000000/sad.png" width="125" height="120" style="display: block; border: 0px;" />
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Your temporary password : ${temppassword}</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <p style="margin: 0;"> Click this button to log in. 👇</p> 
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" bgcolor="#3CBEB2"><a href=http://localhost:3000/seller-login target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #3cbeb2; display: inline-block;">Reactivate Account</a></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr> <!-- COPY -->
              
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Thanks for choosing our template,<br>BBB Team</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                        <p style="margin: 0;"><a href="#" target="_blank" style="color: #3cbeb2;">We’re here to help you out</a></p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                        <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                    </td>
                </tr>
            </table>
            
        </td>
    </tr>
</table>
                     
                     `
          };
          
          // Step 3
          transporter.sendMail(mailOptions, (err, data) => {
              if (err) {
                  return console.log('Error occurs');
              }
              return console.log('Email sent!!!');
          });

            
          
            res.json({mes:"check you email", accesstoken})
            

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    resetPassword: async (req, res, next) =>{
      
      const token = req.header("auth-token");
      const tokenDecode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
          const {password,newPassword} = req.body
          try {
              const seller = await Seller.findById({ _id: tokenDecode.id });
              console.log(seller)
              if(seller && !seller.resetPassword){
                  bcrypt.compare(password, seller.password,async (err,result)=>{
                      if(result){
                          // const hashedPassword = await bcrypt.hash(newPassword, 10);
                          seller.password = newPassword;
                          seller.resetPassword = true
              
                          const newPass = await seller.save();
                          res.status(201).send(newPass);
                      }else{
                          res.status(401).send("password incorrect check your email");
                      }
                  })
              }
          
              
          } catch (error) {
              console.log(error);
          }
     
  },

  
  Login : async (req, res, next) =>{
  const { email, password } = req.body

  try {
    const seller = await Seller.findOne({ email });
    if (seller) {
        bcrypt.compare(password, seller.password, (err, result) => {
            if (result) {
                if (seller.isValid) {
                  const accesstoken = createAccessToken({id: seller._id})
                    res.status(200).json({ seller, accesstoken })
                } else {
                    res.status(200).json({message: 'Your account is still being processed' })
                }
            } else {
                res.status(200).json({ message: 'email or password incorrect' })
            }
        })
    } else {
        res.status(401).json({ message: 'we can\'t find this email' })
    }
} catch (error) {

  }

},

getAllSeller: async (req, res) =>{
  Seller.find((err, seller)=>{
    if(err || !seller){
        return res.json({error: 'No data'})
    }
    res.json({seller})
})
},

validSeller: async (req, res, next) =>{
  const seller = await Seller.findById({ _id: req.params.id });
  console.log(seller)
  if (!seller) {
      res.status(404).send({ message: "Seller not found" });
  } else {
      seller.isValid = true;
      const validSeller = await seller.save();
      res.status(201).json({message:'Seller validate'});
  }
},

 sellerSignout : (req, res) => {
    res.clearCookie("token")

    res.json({
        message : "User is Signout"
    })
}




}


function randomPassword(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createAccessToken = (seller) =>{
    return jwt.sign(seller, process.env.ACCESS_TOKEN_SELLER, {expiresIn: '1d'})
}


module.exports = sellerCtrl