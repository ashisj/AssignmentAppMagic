import Api from './Api'

export default {
  login(params){
    return Api().post('api/login',params)
  },
  register(params){
    return Api().post('api/register',params)
  },
  isLogin(params){
    return Api().post('api/isLogin',params)
  }
}