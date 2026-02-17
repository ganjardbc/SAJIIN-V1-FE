import axios from 'axios'

const defaultList = () => {
  return {
    username: '',
    password: '',
    remember: false,
  }
}

export default {
  namespaced: true,

  state: {
    form: defaultList(),
    errorMessage: defaultList(),
    data: null,
    token: null,
    tokenBearer: null,
    user: null,
    role: null,
    permissions: null,
    shop: null,
    selectedShop: null,
    employee: null,
    loading: false,
  },

  getters: {},

  mutations: {
    RESET_ERROR_MESSAGE(state) {
      state.errorMessage = defaultList()
    },
    SET_ERROR_MESSAGE(state, value) {
      state.errorMessage = value
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_TOKEN(state, data) {
      state.token = data.token
      state.tokenBearer = `Bearer ${data.token}`

      $cookies.set('token', data.token)
      $cookies.set('tokenBearer', `Bearer ${data.token}`)
    },
    SET_DATA(state, data) {
      state.data = data
      state.user = data.user
      state.role = data.role
      state.permissions = data.permissions
      
      $cookies.set('user', data.user)
      $cookies.set('role', data.role)
      $cookies.set('permissions', JSON.stringify(data.permissions))

      if (data.user.role_name !== 'admin') {
        state.shop = data.shop
        // state.selectedShop = data.shop[0]
        state.employee = data.employee

        // $cookies.set('shop', JSON.stringify(data.shop))
        // $cookies.set('selectedShop', data.shop[0])
        $cookies.set('employee', data.employee)
      }
    },
    REMOVE_DATA(state) {
      state.data = null
      state.token = null
      state.tokenBearer = null
      state.user = null
      state.role = null
      state.permissions = null
      state.shop = null
      state.selectedShop = null
      state.employee = null

      $cookies.remove('token')
      $cookies.remove('tokenBearer')
      $cookies.remove('user')
      $cookies.remove('role')
      $cookies.remove('shop')
      $cookies.remove('selectedShop')
      $cookies.remove('employee')
      $cookies.remove('permissions')
    },
  },

  actions: {
    setData({ commit }, data) {
      commit('SET_DATA', data)
    },
    removeData({ commit }) {
      commit('REMOVE_DATA')
    },
    getUserData({ commit }, token = '') {
      return axios
        .get('/api/me', { headers: { Authorization: token } })
        .then((res) => {
          if (res.data.status === 'ok') {
            const data = res.data.data
            commit('SET_DATA', data)
          }

          return res
        })
    },
    login({ commit, state }, data) {
      commit('RESET_ERROR_MESSAGE')
      commit('SET_LOADING', true)

      return axios
        .post('/api/auth/loginUsername', data)
        .then((res) => {
          const status = res.data.status
          if (status === 'ok') {
            const data = res.data.data
            commit('SET_DATA', data)
            commit('SET_TOKEN', data)

            let selectedShop = null
            // if (data.user.role_name !== 'admin') {
            //   selectedShop = data.shop[0]
            // }

            return {
              status: status,
              // shopId: selectedShop.shop_id,
              roleName: data.role.role_name,
            }
          }

          if (status === 'invalide') {
            state.errorMessage.username = res.data.message && res.data.message.username && res.data.message.username[0]
            state.errorMessage.password = res.data.message && res.data.message.password && res.data.message.password[0]

            return {
              status: status,
              roleName: data.role.role_name,
            }
          }

          return {
            status: status,
          }
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    },
    register({ commit, state }, data) {
      commit('RESET_ERROR_MESSAGE')
      commit('SET_LOADING', true)

      return axios
        .post('/api/auth/register', data)
        .then((res) => {
          const status = res.data.status
          if (status === 'invalide') {
            const message = res.data.message
            commit('SET_ERROR_MESSAGE', message)
          }
          return res
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    },
    logout({ commit }, token = '') {
      commit('SET_LOADING', true)

      return axios
        .post(
          '/api/logout',
          { token: token },
          { headers: { Authorization: token } }
        )
        .then((res) => {
          commit('REMOVE_DATA')

          return res
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    },
  },
}
