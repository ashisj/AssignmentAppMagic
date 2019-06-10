<template>
    <div class="container">
        <div class="row">
            <div class="card">
                <template v-if="checkOutProducts.length">
                    <ul>
                        <li v-for="product in checkOutProducts">
                            <span>{{product.name}}</span>
                            <span class="float-right">{{product.price}}</span>
                        </li>
                    </ul>
                    <hr>
                    <span>Total</span>
                    <span class="float-right">{{total}}</span>
                </template>
                <template v-else>
                    Nothing to purchase
                </template>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-12">
                <template v-if="checkOutProducts.length">
                    <button class="btn btn-success float-right" @click="placeOrder">Checkout</button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import router from "../router/index";
import AuthenticateService from '@/settings/AuthenticateService.js';
export default {
    name:'Cart',
    data(){
        return {

        }
    },
    computed:{
        checkOutProducts() {
            return this.$store.getters.checkOutProduct;
        },
        total() {
            return this.$store.getters.total;
        }
    },
    methods:{
        placeOrder(){
            if(this.$store.getters.loggedStatus){
                let token = this.$cookies.get('token');
                if(token){
                    AuthenticateService.isLogin({'token':token})
                    .then((response) =>{
                        this.$store.commit('loggedStatus',true);
                        router.push('/checkout')
                    })
                    .catch((error) => {
                        this.$store.commit('loggedStatus',false);
                        alert("Your session has expired please login again !!!!!");
                    });
                } else {
                     alert("Please logged in for check out");
                }
            } else {
                alert("Please logged in for check out");
            }
        }
    }
    
    
}
</script>

<style scoped>

.card{
    min-height:100px;
    width:400px;
    margin:auto;
    padding:10px;
    margin-top: 30px;
}
</style>

