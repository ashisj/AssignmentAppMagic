
exports.payment = (paymentMode) => {
    switch(paymentMode){
        case 'card':

    }
};

function cardPayment(){
    var stripe = require("stripe")(
        "sk_test_JvD4P5vmiWE2JBlh0m9ELKmz00S1H9Vn5q"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });

        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
}

