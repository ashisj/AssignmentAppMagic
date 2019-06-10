import Api from './Api'

export default {
  orderProduct(params){
    return Api().post('api/checkout',params)
  }
}