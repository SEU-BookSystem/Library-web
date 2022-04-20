import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocalStorage = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    token: '',
    gobalSearchText: "",
    gobalSearchType: "",
    hasUnfinishedRoute: false,
    unfinishedRoute: {},
    roleHasLoad: false,
    role: {},
    username: "",
    setToken: {},
    detToken: {},
    yuming:"http://47.94.131.208:8088",
    hasClassChange: false,
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
      sessionStorage.token = payload;
    },
    delToken(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    saveUnfinishedRoute(state, payload) {
      state.hasUnfinishedRoute = true
      state.unfinishedRoute = payload
    },
    clearUnfinishedRoute(state) {
      state.hasUnfinishedRoute = false
    },
    clearCache(state) {
      sessionStorage.removeItem('token')
      state.hasUnfinishedRoute = false
      state.unfinishedRoute = {}
      state.token = ""
      state.role = {}
      state.gobalSearchText = ""
      state.gobalSearchType = ""
      state.username = ""
      state.roleHasLoad = false
    },
    clearCacheWithoutRoute(state) {
      state.token = ""
      state.function = {}
      state.gobalSearchText = ""
      state.gobalSearchType = ""
      state.roleHasLoad = false
    },
    token(state, payload) {
      state.token = payload
    },
    username(state, payload) {
      state.username = payload
    },
    roleHasLoad(state, payload) {
      state.roleHasLoad = payload
    },
    role(state, payload) {
      state.role = payload;
    },
    gobalSearchType(state, payload) {
      state.gobalSearchType = payload
    },
    gobalSearchText(state, payload) {
      state.gobalSearchText = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
