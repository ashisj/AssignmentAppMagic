import Api from './Api'

export default {
  addProduct(params){
    return Api().post('api/admin/addProduct',params)
  },
  showProducts(){
    return Api().get('api/showProducts')
  }
}