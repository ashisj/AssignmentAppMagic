const Product = require('../models/productModel')

exports.addProduct = (req,res,next) => {
    req.checkBody('name', 'Invalid name').notEmpty();
    req.checkBody('price', 'Invalid price').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return res.status(422).json({message : 'Invalid Input' , errors : messages  });
    }
    Product.findOne({name:req.body.name},(error,result) => {
        if(error){
            return next(error)
        }
        if(result){
            return res.status(422).json({ message : 'Product is already added'})
        } 
        let newProduct = new Product();
        newProduct.name  = req.body.name;
        newProduct.price = req.body.price;
        newProduct.save((err,data) => {
            if(err){
                return next(err);
            }
            return res.status(201).json({message:'Product added successfully'});
        })
    })
}

exports.showProducts = (req,res,next) => {
    Product.find({},{_id:0,name:1,price:1},(error,result) => {
        if(error){
            return next(error)
        }
        res.status(200).json({ products : result });
    });
}