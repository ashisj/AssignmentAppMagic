# AssignmentAppMagic

# Payment GateWay Integration

## Frontend setup

```
$ npm install -g @vue/cli
$ npm install -g @vue/cli-init
$ vue init webpack frontend
```

## Backend setup
```
$ mkdir backend
$ express --no-view .
```

## For payments


### Card payment
Card payment is implemented by using 3rd party software 'STRIPE'
Use '4242424242424242' as test card number

In side frontend/index.html add
```
<script type="text/javascript" src="https://js.stripe.com/v2/"></script>
```

create a Card.vue file inside frontend/src/component and add
```
    <template>
        <div class="row">
            <form>
                <h4 class="col-sm-12">Card Information</h4>
                <div class="col-sm-12">            
                    <div class="form-group">
                        <label>Card Holder Name</label>
                        <input type="text" class="form-control" placeholder="card holder name" v-model="card.name" required>
                    </div>
                </div>
                <div class="col-sm-12">            
                    <div class="form-group">
                        <label>Card Number</label>
                        <input type="text" class="form-control" placeholder="XXXXXXXXXXXXXXXX" v-model="card.number" required>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>CVC</label>
                                <input type="text" class="form-control" placeholder="CVC" v-model="card.cvc" required>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Expiration Date</label>
                                <input type="text" class="form-control" placeholder="MM/YY" v-model="card.exp" required>
                            </div>    
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <button class="btn btn-primary btn-block" @click.prevent="validate">Submit</button>
                </div>
            </form>
            <div v-show="errors">
                <div class="col-sm-12">
                    <ol class="text-danger">
                        <li v-for="(error, index) in errors" :key="index">
                        {{ error }}
                        </li>
                    </ol>
                </div>        
            </div>
        </div>
    </template>

    <script>
    import router from "../router/index";
    import OrderService from '@/settings/OrderService.js';
    export default {
        name:'Card',
        props: ['details'],
        data(){
            return {
                card:{
                    name:'',
                    number:'',
                    cvc:'',
                    exp:'',
                },
                errors: [],
                product:[],
                stripePublishableKey: 'pk_test_XrYN0l7oYlOJBctqja66vgJ400rZrPc0G3',
                stripeCheck: false,
            }
        },
        mounted(){
            this.product = this.$store.getters.checkOutProduct;
        },
        methods:{
            validate() {
                this.errors = [];
                let valid = true;
                if (!this.card.name) {
                    valid = false;
                    this.errors.push('Card Holder Name is required');
                }
                if (!this.card.number) {
                    valid = false;
                    this.errors.push('Card Number is required');
                }
                if (!this.card.cvc) {
                    valid = false;
                    this.errors.push('CVC is required');
                }
                if (!this.card.exp) {
                    valid = false;
                    this.errors.push('Expiration date is required');
                }
                if (valid) {
                    this.createToken();
                }
            },
            createToken() {
                this.stripeCheck = true;
                window.Stripe.setPublishableKey(this.stripePublishableKey);
                window.Stripe.createToken(this.card, (status, response) => {
                    if (response.error) {
                        this.stripeCheck = false;
                        this.errors.push(response.error.message);
                        console.error(response);
                    } else {
                        let orderData = {
                            name : this.details.name,
                            address : this.details.address,
                            paymentMode : this.details.paymentMode,
                            paymentId : response.id,
                            product : this.product,
                            token : this.$cookies.get('token')
                        }
                        OrderService.orderProduct(orderData)
                        .then((response) => {
                            alert(response.data.message);
                            this.$store.commit('checkOutProduct',[]);
                            router.push('/')
                        })
                        .catch((error) => {
                            if(error.response.status == 401){
                                this.$store.commit('loggedStatus',false);
                                alert('Your session expired');
                                router.push('/cart')
                            }
                        }) 
                    }
                });
            }
        }
    }
    </script>

    <style scoped>

    </style>
```

The below function is used to create a token for the stripe payment which we will use to deduct money using nodejs script.

```
    createToken() {
        this.stripeCheck = true;
        window.Stripe.setPublishableKey(this.stripePublishableKey);
        window.Stripe.createToken(this.card, (status, response) => {
            if (response.error) {
                this.stripeCheck = false;
                this.errors.push(response.error.message);
                console.error(response);
            } else {
                let orderData = {
                    name : this.details.name,
                    address : this.details.address,
                    paymentMode : this.details.paymentMode,
                    paymentId : response.id,
                    product : this.product,
                    token : this.$cookies.get('token')
                }
                OrderService.orderProduct(orderData)
                .then((response) => {
                    alert(response.data.message);
                    this.$store.commit('checkOutProduct',[]);
                    router.push('/')
                })
                .catch((error) => {
                    if(error.response.status == 401){
                        this.$store.commit('loggedStatus',false);
                        alert('Your session expired');
                        router.push('/cart')
                    }
                }) 
            }
        });
    }   

In backend install stripe
```
npm i stripe
```

for payment add the below methods

```
cardPayment = (paymentAmount,token,user,done) => {
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
```
below method will be used to store order and payment details in data base and to send mail to user 

```
cardPayment(req.body.product[0].price,req.body.paymentId,req.user.email,(err,transactionId) => {
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
```

### paypal payment

configure your app in paypal and get the clien id and client secret for payment

inside frontend/src/Wallet.vue add
```
<template>
    <div class="row">
        <div class="col-sm-12">
            <h4>Wallet Payment</h4>
            <div id="paypal-button-container"></div>
            <div v-if="success" class="alert alert-success">
                <strong>Success!</strong> Payment successfuly done
            </div>
            <div v-if="error" class="alert alert-danger">
                <strong>Ooops!</strong>  something went wrong
            </div>
        </div>                    
    </div>
</template>

<script>
import router from "../router/index";
import OrderService from '@/settings/OrderService.js';
export default {
    name:'Wallet',
    props: ['details'],
    data(){
        return {
            product : [],
            success : '',
            error : ''
        }
    },
    mounted(){
        this.product = this.$store.getters.checkOutProduct;
        let  client = {
            sandbox : "AT6RAkYF59bY2W5ChkpmdqkMWCRUoMAEOdbQQ1QHwpsxEmg-jj-csSTn_cR46qWKsxvhNr-ONhRekc0H"
        }

        let  payment = (data, actions) => {
        // Make a call to the REST api to create the payment
            return actions.payment.create({
                payment: {
                    transactions: [
                        {
                        amount: { total:this.product[0].price, currency: 'USD' }
                        } 
                    ]
                }
            });
        }

        let  onAuthorize = (data) => {
            var data = {
                paymentID: data.paymentID,
                payerID: data.payerID,
                amount:this.product[0].price
            };
            this.sendDataPaypal({data:data})
                .then((response) => {
                    alert(response.data.message);
                    this.$store.commit('checkOutProduct',[]);
                    router.push('/')
                }).catch(err=>{
                    this.$store.commit('loggedStatus',false);
                    alert('Your session expired');
                    router.push('/cart')
                });
        }

        paypal.Button.render({
            env: 'sandbox', // sandbox | production
            commit: true,
            client,
            payment,
            onAuthorize
        }, '#paypal-button-container');

        
    },
    methods:{
        sendDataPaypal ( data) {
            data.name = this.details.name;
            data.address = this.details.address;
            data.paymentMode = this.details.paymentMode;
            data.product = this.product,
            data.token = this.$cookies.get('token')
            
            return new Promise((resolve, reject) => {
                OrderService.orderProduct(data)
                    .then(res =>{
                        return resolve(res)
                    })
                    .catch((err) => {
                        return reject(err)
                    })
            })
        }
        
    }
}
</script>

<style scoped>

</style>

```

here after clicking payment but we will get an payment id which will use for deduct money from account and generate a paymentid which will be stored in database

In the backend instaall 'paypal-rest-sdk'

below method will use to deduct money from paypal account using generated paymentid from frontend
```

const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': process.env.PAYPAL_ENVIRONMENT, //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID, // please provide your client id here
    'client_secret': process.env.PAYPAL_CLIENT_SECRET // provide your client secret here
});


paypalPayment = (paymentID,execute_payment_json,payment,done) => {
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
```

below code will used to save data in database
```
var execute_payment_json = {
    "payer_id": req.body.data.payerID,  
};
const payment ={}
payment.amount=req.body.data.amount
const paymentID=req.body.data.paymentID
paypalPayment(paymentID,execute_payment_json,payment,(err,result)=>{
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
```

### Send mail 
below codes are used to send mail using google services
```
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
```

