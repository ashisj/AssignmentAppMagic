<template>
    <div class="container">
        <div class="row">
            <template v-for="product in products">
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class="card">
                        <div class="card-body">{{product.name}}</div>
                        <hr>
                        <div class="clearfix">    
                            <span class="price">{{product.price}}</span>
                            <button class="btn btn-sm btn-success float-right" @click="buyProduct(product)">
                                <router-link to="/cart">Add to cart</router-link>
                            </button>
                        </div>
                    </div>        
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import ProductService from '@/settings/ProductService.js';
export default {
    name:'Home',
    data(){
        return {
            products : []
        }
    },
    mounted(){
        ProductService.showProducts()
         .then((response) => {
            this.products = response.data.products
         })
         .catch((error) => {
             console.log(error);
         })
    },
    methods:{
       buyProduct(product){
           let checkOutProducts=[]
           let checkOutProductData = {
               name  : product.name,
               price : product.price
           }
           checkOutProducts.push(checkOutProductData)
           this.$store.commit('checkOutProduct',checkOutProducts);
       } 
    }
}
</script>

<style scoped>

.card{
    /*width:400px;*/
    padding:10px;
    margin-top: 30px;
}
button a{
    color: white;
    text-decoration: none;
}
</style>

