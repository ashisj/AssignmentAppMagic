<template>
  <div>
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <!-- Brand/logo -->
      <router-link class="navbar-brand" to="/">AppMagic</router-link>
      
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-4"
          aria-controls="navbarSupportedContent-4" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
    <!-- Links -->
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent-4">
          <ul class="nav navbar-nav ml-auto">
              <li class="nav-item"><router-link class="nav-link" to="/cart">Cart</router-link></li>
              <template v-if="this.$store.state.loggedStatus">
                <li class="nav-item"><button type="button" @click="logout">Logout</button></li>                
              </template>
              <template v-else>  
                <li class="nav-item"><button type="button" data-toggle="modal" data-target="#loginModal">Login</button></li>
              </template>
          </ul>
      </div>   
    </nav>
    <div class="row">
      <div class="col-sm-12">
          <div class="modal" id="loginModal">
            <div class="modal-header">
              <h4 class="modal-title">Registration & Login</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <login></login>
            </div>
          </div>
      </div>
    </div>
  </div>
  
</template>
<script>
import AuthenticateService from '@/settings/AuthenticateService.js';
import Login from '@/components/Login'
export default {
  data(){
    return {
      loggedStatus:false
    }
  },
  components:{
    login:Login
  },
  mounted(){
    let token = this.$cookies.get('token');
    // let data = {
    //   token : token
    // } 
    
    if(token){
      AuthenticateService.isLogin({token:token})
        .then((response) =>{
          this.$store.commit('loggedStatus',true);
        })
        .catch((error) => {
          this.$store.commit('loggedStatus',false);
        })
    } else {
      this.$store.commit('loggedStatus',false);
    }
  },
  methods:{
    logout(){
      this.$cookies.remove('token');
      this.$store.commit('loggedStatus',false);
    }
  }
}
</script>
<style scoped>
#loginModal{
  background: white;
  width:60%;
  height: auto;
  padding: 20px;
  margin: 20px 20%;
}
</style>
