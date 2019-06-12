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

