var Order = require('../models/userModel');

exports.placeOrder = (req,res,next)=>{
    console.log(req.user);
    
    order = new Order();
    order.user = req.user;
    order.cart = req.body.product;
    order.name = req.body.name;
    order.paymentMode = req.body.paymentMode
    order.address = req.body.address
    order.paymentId = req.body.paymentId

    order.save()
     .then((response) => {
        console.log(response);
     })
     .catch((error) => {
         console.log(error);
     })
     return res.send('success');
};
