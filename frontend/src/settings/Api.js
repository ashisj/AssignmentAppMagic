import axios from 'axios';

export default() => {
  return axios.create({
    baseURL: 'http://localhost:4000'
    /*header : {
      'Content-Type' : 'application/x-www-form-urlencoded'
    }*/
  })
}