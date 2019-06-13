<template>
  <div class>
    <button @click.prevent = "payment">RazorPay</button>
  </div>
</template>

<script>
import router from "../router/index";
import OrderService from '@/settings/OrderService.js';
export default {
  name: 'Rozorpay',
  props: ['details'],
  data () {
    return {
      options : {},
      product : [],
    }
  },
  mounted(){
    this.product = this.$store.getters.checkOutProduct;
    this.options = {
        "key": "rzp_test_x4zIGgzu2lMWdp",
        "amount": this.product[0].price*72.75*100, 
        "name": "App Magic",
        "description": "payment by " + this.details.name,
        // "image": "/your_logo.png",
        "handler": (response) => {
            this.successPayment(response.razorpay_payment_id);
        },
        "prefill": {
            "name": "Ashis Kumar",
            "email": "ashis.jena96@gmail.com"
        },
        // "notes": {
        //     "address": "Hello World"
        // },
        "theme": {
            "color": "#F37254"
        }
    };
  },
  methods:{
    payment(){
      var razorpay = new Razorpay(this.options);
      razorpay.open();
    },
    successPayment(data){
      let orderData = {
        name : this.details.name,
        address : this.details.address,
        paymentMode : this.details.paymentMode,
        paymentId : data,
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
