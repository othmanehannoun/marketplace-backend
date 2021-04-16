const jwt = require("jsonwebtoken");

const authSeller =  (req, res, next) =>{
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.seller = verified;
    next();
    
  } catch (error) {
    res.status(500).json({msg: err.message});
  }
};

module.exports = authSeller