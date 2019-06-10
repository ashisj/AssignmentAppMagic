<template>
    <div class="container">
      <div class="authenticationCard">
        <div class="card">
          <div class="card-header">
            <ul class="nav">
              <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#login">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#register">Register</a>
              </li>
            </ul>
          </div>
          
          <div class="card-body">
              <!-- Login -->
             <div class="tab-content">
               <div id="login" class="container tab-pane active">
                  <div class="text-danger">{{loginMessage}}</div>
                 <form @submit.prevent="login">
                   <div class="form-group">
                     <label for="loginUserName">Email:</label>
                     <input type="text" class="form-control" v-model="loginForm.email" id="loginUserName" placeholder="Enter username" required>
                   </div>
                   <div class="form-group">
                     <label for="loginPwd">Password:</label>
                     <input type="password" class="form-control" v-model="loginForm.password" id="loginPwd" placeholder="Enter password" required>
                   </div>
                   <button type="submit" class="btn btn-primary">Log in</button>
                 </form>
               </div>

                <!-- Register -->
               <div id="register" class="container tab-pane tab-fade">
                 <div :class="{'text-success':success,'text-danger':failure}">{{registrationMessage}}</div>
                 <form @submit.prevent="register">
                   <div class="form-group">
                     <label for="registerEmail">Name:</label>
                     <input type="text" class="form-control" v-model="registerForm.name" id="registerEmail" placeholder="Enter email" required>
                   </div>
                   <div class="form-group">
                     <label for="registerEmail">Email:</label>
                     <input type="text" class="form-control" v-model="registerForm.email" id="registerEmail" placeholder="Enter email" required>
                   </div>
                   <div class="form-group">
                     <label for="registerPwd">Password:</label>
                     <input type="password" class="form-control" v-model="registerForm.password" id="registerPwd" placeholder="Enter password" required>
                   </div>
                   <button type="submit" class="btn btn-primary">Register</button>
                 </form>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
</template>
<script>
import AuthenticateService from '@/settings/AuthenticateService.js';
export default {
    name:'Login',
    data(){
        return {
            loginForm:{
                email:'',
                password:''
            },
            registerForm:{
                name:'',
                email:'',
                password:''
            },
            loginMessage : '',
            registrationMessage : '',
            success : false,
            failure : false
        }
    },
    methods:{
        login(){
            AuthenticateService.login(this.loginForm)
             .then((response)=>{
                this.$cookies.set('token',response.data.token);
                this.$store.commit('loggedStatus',true);
                $('#loginModal').modal('hide');
                this.loginMessage = "";
                this.registrationMessage = "";
                this.loginForm.email = ''
                this.loginForm.password = ''
             })
             .catch((error) => {
                 this.$store.commit('loggedStatus',false);
                 this.loginMessage = "Authentication failed!!!";
             })
        },
        register(){
            AuthenticateService.register(this.registerForm)
            .then((response) => {
                this.failure = false
                this.success = true
                this.registrationMessage = response.data.message
                this.registerForm.name = ''
                this.registerForm.email = ''
                this.registerForm.password = ''
            })
            .catch((error) => {
                this.failure = true
                this.success = false
                this.registrationMessage = "Registration Unsuccessful!!!!!"
            })
        }
    }
}
</script>

