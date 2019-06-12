const Order = require('../models/orderModel');
const MailMiddleware = require('../../middleware/mailMiddleware');
const Payment = require('./paymentController')
exports.placeOrder = (req,res,next)=>{
    
    let message =''
    order = new Order();
    order.user = req.user;
    order.products = req.body.product;
    order.name = req.body.name;
    order.paymentMode = req.body.paymentMode;
    order.address = req.body.address; 
    switch(req.body.paymentMode){
        case 'card':
                Payment.cardPayment(req.body.product[0].price,req.body.paymentId,req.user.email,(err,transactionId) => {
                if(err){
                    message = "Your transaction failed";
                    sendMail(req.user.email,message);
                    return next(err);
                }else{
                    order.paymentId = transactionId;
                    order.save()
                        .then((response) => {
                            message = "Your order placed successfully having transaction id " + transactionId ;
                            sendMail(req.user.email,message)
                            res.status(202).json({message:'Order placed successfully'})
                        })
                        .catch((error) => {
                            res.status(202).json({message:'Order did not placed successfull, you will get your refund within 24 hours '})
                            //console.log(error.message);
                        });
                }
            });
            break
        case 'wallet':
                var execute_payment_json = {
                    "payer_id": req.body.data.payerID,  
                };
                const payment ={}
                payment.amount=req.body.data.amount
                const paymentID=req.body.data.paymentID
                Payment.paypalPayment(paymentID,execute_payment_json,payment,(err,result)=>{
                    if(err){
                        message = "Your transaction failed";
                        sendMail(req.user.email,message); 
                        return next(err);   
                    } else {
                        order.paymentId = result;
                        order.save()
                            .then((response) => {
                                message = "Your order placed successfully having transaction id " + result ;
                                sendMail(req.user.email,message);
                                res.status(202).json({message:'Order placed successfully'})
                            })
                            .catch((error) => {
                                //console.log(error.message);
                                res.status(202).json({message:'Order did not placed successfull, you will get your refund within 24 hours '})
                            });
                    }            
                });
            break;
            case 'cod':
                order.save()
                    .then((response) => {
                        message = "Your order placed successfully, please pay during delivery";
                        sendMail(req.user.email,message);
                        res.status(202).json({message:'Order placed successfully'})
                    })
                    .catch((error) => {
                        //console.log(error.message);
                        res.status(202).json({message:'Order did not placed successfull'})
                    });         
            break;    
        default:
            res.status(202).json({message:'Invalid payment options'})
                
    }
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

