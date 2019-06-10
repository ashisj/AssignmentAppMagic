import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state:{
    checkOutProduct : [],
    total : 0,
    loggedStatus : false
  },
  getters:{
    checkOutProduct: state => {
      return state.checkOutProduct;
    },
    total : state => {
      state.total = 0;
      state.checkOutProduct.forEach((value) => {
        state.total += value.price
      });
      return state.total;
    },
    loggedStatus : state => {
      return state.loggedStatus;
    }
  },
  mutations:{
    checkOutProduct:(state,product) => {
      state.checkOutProduct = product;
    },
    loggedStatus : (state,status) => {
      state.loggedStatus = status;
    }
  }
})
