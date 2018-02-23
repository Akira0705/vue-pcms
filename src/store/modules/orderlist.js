import {
  getorderlist,
  searchorderlist,
  searchpayfororderlist
} from '@/api/orderlist.js'

const order = {
  state: {
    pageInfo: null,
    content: [],
    fk_name: null,
    type: ""
  },
  getters: {
    orderPage: state => state.pageInfo,
    orderInfo: state => state.content,
    orderType: state => state.type
    // fkInfo: state => state.fk_name
  },
  mutations: {
    GETORDERLIST: (state, result) => {
      state.pageInfo = result.pageInfo;
      state.content = result.content;
      state.fk_name = result.fk_name;
    },
    NAVLSIT: (state, result) => {
      state.type = result.type;
    }
  },
  actions: {
    GetOrderList({
      commit
    }, params = {}) {
      return new Promise((resolve, reject) => {
        getorderlist(params.pageInfo, params.type).then(result => {
          commit('GETORDERLIST', {
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
    SearchOrderList({
      commit
    }, params = {}) {
      return new Promise((resolve, reject) => {
        searchorderlist(params).then(result => {
          commit('GETORDERLIST', {
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
    SearchPayforOrderList({
      commit
    }, params = {}) {
      return new Promise((resolve, reject) => {
        searchpayfororderlist(params).then(result => {
          commit('GETORDERLIST', {
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
    // 首页点击相应按钮，导航到指定列表
    NavOrderList({
      commit
    }, params = {}) {
      commit('NAVLSIT', params);
    }
  }
}

export default order
