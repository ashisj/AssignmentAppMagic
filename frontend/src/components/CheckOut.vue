<template>
    <div class="container">
        <div class="card">
            <div class="row">
                <div class="col-sm-12">
                    <h4 class="float-right">Total : {{total}}</h4>
                </div>
                <div class="col-sm-12 col-md-6">
                    <form>
                        <h4>User Information</h4>
                        <div class="form-group">
                            <label class="name"> Name</label>
                            <input type="text" class="form-control" id = "name" v-model="paymentDetails.name">
                        </div>
                        <div class="form-group">
                            <label class="address"> Address</label>
                            <input type="text" class="form-control" id = "name" v-model="paymentDetails.address">
                        </div>
                    </form>
                                        
                    <div class="payment-mode-box">
                        <h4>Payment Mode</h4>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input" value = "card" v-model="paymentDetails.paymentMode">Credit / Debit / ATM Card
                            </label>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input" value = "wallet" v-model="paymentDetails.paymentMode">Wallet
                            </label>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input" value = "netBanking" v-model="paymentDetails.paymentMode">Net Banking
                            </label>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input" value = "cod" v-model="paymentDetails.paymentMode">Cash on Delivery
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-4 offset-md-2">
                    <template v-if="paymentDetails.paymentMode == 'card'">
                        <payment-card :details="paymentDetails"></payment-card>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from "../router/index";
import AuthenticateService from '@/settings/AuthenticateService.js';
import Card from './Card.vue';
export default {
    name :'CheckOut',
    components : {
        'payment-card': Card
    },
    data(){
        return {
            paymentDetails : {
                paymentMode : '',
                name        : '',
                address     : '',
            }
        }
    },
    computed:{
        total() {
            return this.$store.getters.total;
        }
    },
    mounted(){
        if(this.$store.getters.loggedStatus){
            let token = this.$cookies.get('token');
            if(token){
                AuthenticateService.isLogin({'token':token})
                .then((response) =>{
                    this.$store.commit('loggedStatus',true);
                    return
                })
                .catch((error) => {
                    this.$store.commit('loggedStatus',false);
                    router.push('/cart')
                });
            } else {
                    router.push('/cart')
            }
        } else {
            router.push('/cart')
        }
        
    }
}
</script>

<style scoped>

.card{
    padding: 10px;
    background: antiquewhite;
}
form{
    width:300px;
    margin:auto;
}
.payment-mode-box{
    min-height:100px;
    width:300px;
    margin:auto;
    padding:10px;
    margin-top: 30px;
    border: 2px solid grey;
}
</style>