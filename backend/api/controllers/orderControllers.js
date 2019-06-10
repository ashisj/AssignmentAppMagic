const Order = require('../models/orderModel');
const MailMiddleware = require('../../middleware/mailMiddleware');

exports.placeOrder = (req,res,next)=>{
    let message =''
    order = new Order();
    order.user = req.user;
    order.products = req.body.product;
    order.name = req.body.name;
    order.paymentMode = req.body.paymentMode
    order.address = req.body.address
    
    switch(req.body.paymentMode){
        case 'card':
            cardPayment(req.body.product[0].price,req.body.paymentId,req.user.email,(err,transactionId) => {
                if(err){
                    message = "Your transaction failed";
                    sendMail(req.user.email,message)
                }else{
                    order.save()
                        .then((response) => {
                            message = "Your order placed successfully having transaction id " + transactionId ;
                            sendMail(req.user.email,message)
                        })
                        .catch((error) => {
                            console.log(error.message);
                        });
                }
            });
            
            
            break    
        default:
             console.log(1);
                
    }
    return res.send('success');
    

};

function setMailOption(email,message) {
    
    return {
        from: '"Ashis" ashisjenamfs@gmail.com', 
        to: email, 
        subject: 'Order Details',
        
        text: message,
        html: `<b>${message}</b>` 
    }
};
function sendMail(userEmail,message){
    let transporter = MailMiddleware.mailService
    mailOptions = setMailOption(userEmail,message);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
}

function cardPayment(paymentAmount,token,user,done){
    var stripe = require("stripe")(
        "sk_test_JvD4P5vmiWE2JBlh0m9ELKmz00S1H9Vn5q"
    );

    stripe.charges.create({
        amount: paymentAmount * 100,
        currency: "usd",
        source: token,
        description: "payment by user " + user
    }, function(err, charge) {
        if(err){
            return done(err,null)
        }
        return done(null,charge.id)
    });
}
