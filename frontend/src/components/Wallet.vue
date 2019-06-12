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

