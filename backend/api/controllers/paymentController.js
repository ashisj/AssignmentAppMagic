const Payment = {};
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': process.env.PAYPAL_ENVIRONMENT, //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID, // please provide your client id here
    'client_secret': process.env.PAYPAL_CLIENT_SECRET // provide your client secret here
});


Payment.paypalPayment = (paymentID,execute_payment_json,payment,done) => {
    paypal.payment.execute(paymentID,execute_payment_json,(error, paymentLog)=> {
        if (error) {
            return done(error,null)
        }
        else{
            //the logic after  successful payment  here just save the payment in a databse 
            payment.email=paymentLog.payer.payer_info.email
            payment.first_name=paymentLog.payer.payer_info.first_name
            payment.last_name=paymentLog.payer.payer_info.last_name

            done(null,paymentLog.id);

            //payment.create(payment).exec((err, result) => {
                //done(null,result);     
            //})
        }
    })
}

Payment.cardPayment = (paymentAmount,token,user,done) => {
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

module.exports = Payment