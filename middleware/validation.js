
const Joi = require("joi");

// Register validation
const registerValidation = data => {
  const validaionSchema = Joi.object({
    full_name: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(14).required(),
    password: Joi.string().min(10).required(),
    address: Joi.string().min(6).required(),
  });
  return validaionSchema.validate(data);
};

// Register validation
const registerSellerValidation = data => {
    const validaionSchema = Joi.object({
      full_name: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(14).required(),
      address: Joi.string().min(6).required(),
    });
    return validaionSchema.validate(data);
  };

// Login validation
const loginValidation = data => {
  const validaionSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required()
  });
  return validaionSchema.validate(data);
};

module.exports =
{
     registerValidation, 
     registerSellerValidation, 
     loginValidation
};