const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('./database/config');
const multer = require('multer')

const server = express();

//routes
var indexRouter = require('./routes/index');
var userRouter = require('./routes/User');
var productRouter = require('./routes/Product');
var adminRouter = require('./routes/Admin')
var sellerRouter = require('./routes/Seller');
var category = require('./routes/Category')

server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: false }));
//server.use(express.static(path.join(__dirname, 'public')));


server.use('/', indexRouter);
server.use('/user', userRouter);
server.use('/products', productRouter);
server.use('/admin', adminRouter)
server.use('/seller', sellerRouter)
server.use('/', category)


// error handler
server.use((req,res,next)=>{
  res.status(404).send('Sorry Dont find this route');
  
});

const PORT = process.env.PORT || 4000
server.listen(PORT,()=>{
 console.log(`Server listen this Port ${PORT}`);
});

module.exports = server
