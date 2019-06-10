<template>
    <div>
        <form @submit.prevent="addProduct" @input="clearMessage">
            <div class="card">
                <span v-bind:class="{'text-success':success,'text-danger':failure}">{{message}}</span>
                <!-- <div class="form-group">
                    <label for="productImg">Product Image:</label>
                    <input type="file" id="productImg" ref="product.productImg" @change="filesChange($event.target.name, $event.target.files)" required >
                </div> -->
                <div class="form-group">
                    <label for="email">Product Name:</label>
                    <input type="text" class="form-control" id="email" v-model="product.name" required>
                </div>
                <div class="form-group">
                    <label for="price">Price:</label>
                    <input type="text" class="form-control" id="price" v-model="product.price" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Product</button>
            </div>
        </form>
    </div>
</template>

<script>
import ProductService from '@/settings/ProductService.js';
export default {
    name:'DataUpload',
    data(){
        return {
            product : {
                name  :'',
                price : '',
                productImg : ''
            },
            success : false ,
            failure : true,
            message :''
        }
    },
    methods:{
       addProduct(){
           ProductService.addProduct(this.product)
            .then((response) => {
                this.failure = false
                this.success = true
                this.message = response.data.message
            })
            .catch((error) => {
                this.success = false
                this.failure = true
                this.message = error.response.data.message
            })
       },
       clearMessage(){
           this.message = ''
       } 
    }
}
</script>

<style scoped>
.card{
    width:400px;
    margin:auto;
    padding:10px;
    margin-top: 30px;
}
</style>

