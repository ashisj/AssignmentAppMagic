var User = require('../models/userModel');
const jwt = require('jsonwebtoken')

exports.register = (req,res,next)=>{
    req.checkBody('name', 'Invalid name').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
  if (errors) {
      res.status(400).json({message:"Invalid input"});
  } else{
    User.findOne({'email':req.body.email},(err,user) => {
      if(err){
        return next(err);
      }
      if(user){
        res.status(409).json({message:'Email is already exists.'});
      } else {
        var newUser = new User();
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.name = req.body.name;
        newUser.save(function(error,result){
          if(error){
            return next(error);
          }
          res.status(202).json({message:"Registration successfull"});
        });
      }
    });
  }
};

exports.login = (req,res,next) => {
  User.findOne({'email': req.body.email},(err,user) => {
    if(err){
      return next(err)
    }
    if(user){
      if(!user.validPassword(req.body.password)){
        res.status(401).json({message:'Authentication Failed'});
      } else {     
        var token = jwt.sign(
          {
            email:user.email,
            _id : user._id,
            //password:user.password
          },
          process.env.JWT_PRIVATE_KEY,
          {
            expiresIn: 3000
          }
        );
        res.cookie('token',token);
        res.status(200).json({token:token,message:"success"});
      }
    } else {
      res.status(401).json({message:'Authentication Failed'})
    }
  });
};