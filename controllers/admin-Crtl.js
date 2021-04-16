const Admin = require('../models/AdminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const AdminCtrl = {
    adminRegister: async (req, res) =>{
        try {
            const {full_name, email, phone, password, address} = req.body;

            const admin = await Admin.findOne({email})
            if(admin) return res.status(400).json({msg: "The email already exists."})

            if(password.length < 6) 
                return res.status(400).json({msg: "Password is at least 6 characters long."})

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newAdmin = new Admin({
                full_name, 
                email, 
                phone, 
                password : passwordHash, 
                address
            })

            // Save mongodb
            await newAdmin.save()

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({id: newAdmin._id})
  
            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    login: async(req, res) =>{

        try {
            const {email, password} = req.body;

            const admin = await Admin.findOne({email})
            if(!admin) return res.status(400).json({msg: "User does not exist."})

            const isMatch = await bcrypt.compare(password, admin.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

              if(admin.super_admin){
                const accesstoken = createAccessToken({id: admin._id})
                res.json({"super_Admin" : accesstoken})
              }else if(admin.isAdmin){
          
                const accesstoken = createAccessToken({id: admin._id})
                res.json({"Admin" : accesstoken})

                res.status(200).send(token);
              }


            // If login success , create access token 

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }

    },


    getAdmin: async (req, res) =>{
        Admin.find((err, admin)=>{
            if(err || !admin){
                return res.json({error: 'No data'})
            }
            res.json({admin})
        })
    },
  
    deleteAdmin : async (req, res, next) =>{
        try {
          const admin = await Admin.findByIdAndDelete({ _id: req.body.idadmin });
    
          if (!admin) {
            res.status(404).send("Admin Not Found");
          }
          else {
            res.send('admin deleted')
          }
        } catch (error) {
          console.log(error);
        }
      }
}




const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN_ADMIN, {expiresIn: '1d'})
}






module.exports = AdminCtrl