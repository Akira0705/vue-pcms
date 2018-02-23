import {
  getCustomerList,
  searchcustomerlist
} from '@/api/customer.js'

const customer = {
  state: {
    pageInfo: null,
    content: [],
    fk_name: null,
    type: ""
  },
  getters: {
    customerPage: state => state.pageInfo,
    customerInfo: state => state.content,
    customerType: state => state.type
    // fkInfo: state => state.fk_name
  },
  mutations: {
    GETCUSTOMERLIST: (state, result) => {
      state.pageInfo = result.pageInfo;
      state.content = result.content;
      // state.fk_name = result.fk_name;
    },
    NAVLSIT: (state, result) => {
      state.type = result.type;
    }
  },
  actions: {
    GetCustomerList({
      commit
    }, params = {}) {
      return new Promise((resolve, reject) => {
        getCustomerList(params.pageInfo, params.type).then(result => {
          commit('GETCUSTOMERLIST', {
            content: result.data.list,
            pageInfo: {
              pageSize: Number(result.data.pageSize),
              pageNum: Number(result.data.pageNum),
              totalItems: Number(result.data.totalItems)
            },
            fk_name: result.fk_name
          })
          resolve(result)
        })
      })
    },
    SearchCustomerList({
      commit
    }, params = {}) {
      return new Promise((resolve, reject) => {
        searchcustomerlist(params).then(result => {
          commit('GETCUSTOMERLIST', {
            content: result.data.list,
            pageInfo: {
              pageSize: Number(result.data.pageSize),
              pageNum: Number(result.data.pageNum),
              totalItems: Number(result.data.totalItems)
            }
          })
          resolve(result)
        })
      })
    },
    // 首页点击相应按钮，导航到指定列表
    NavCustomerList({
      commit
    }, params = {}) {
      commit('NAVLSIT', params);
    }
  }
}

export default customer
