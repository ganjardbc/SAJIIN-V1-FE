import axios from 'axios'
import apiv2 from '@/services/axios'

const defaultMessage = () => {
  return {
    id: '',
    category_id: '',
    image: '',
    name: '',
    status: '',
    description: '',
    shop_id: '',
  }
}

const defaultForm = () => {
  return {
    name: '',
    status: 'active',
    description: '',
    shop_id: '',
  }
}

export default {
  namespaced: true,

  state: {
    form: defaultForm(),
    errorMessage: defaultMessage(),
    limit: 10,
    offset: 0,
    totalRecord: 0,
    loading: false,
    loadMore: false,
    loadingForm: false,
    typeForm: 'create',
    selectedIndex: '',
    data: [],
    filter: {
      search: '',
      status: 'active',
    },
  },

  getters: {},

  mutations: {
    RESET_ERROR_MESSAGE(state) {
      state.errorMessage = defaultMessage()
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_LOAD_MORE(state, value) {
      state.loadMore = value
    },
    SET_LOADING_FORM(state, value) {
      state.loadingForm = value
    },
    SET_OFFSET(state, value) {
      state.offset += value
    },
    SET_DATA(state, value) {
      state.data = value
    },
    SET_MESSAGE_DATA(state, value) {
      if (value) {
        state.errorMessage = value
      } else {
        state.errorMessage = defaultMessage()
      }
    },
    SET_FORM_DATA(state, value) {
      if (value) {
        state.form = value
      } else {
        const time = new Date().getTime()
        state.form = {
          ...defaultForm(),
          category_id: `CT-${time}`,
          status: 'active',
          is_available: 1,
        }
      }
    },
    SET_TOTAL_RECORD(state, value) {
      state.totalRecord = value
    },
  },

  actions: {
    setPagination({ commit, state }, data) {
      state.offset = (data - 1) * state.limit
    },
    setFormData({ commit, state }, data) {
      commit('SET_FORM_DATA', data)
    },
    resetFormData({ commit, state }) {
      commit('SET_FORM_DATA', null)
      commit('SET_MESSAGE_DATA', null)
    },
    resetFilter({ commit, state }) {
      state.limit = 10
      state.offset = 0
    },
    getData({ commit, state }, data) {
      commit('SET_LOADING', true)

      let dataPrev = []

      let params = {
        shopId: data.shop_id,
      }

      return apiv2
        .get(`/api/categories`, {params})
        .then((res) => {
          const payload = res.data.data
          commit('SET_DATA', payload)
          commit('SET_TOTAL_RECORD', res.data.pagination.totalItem)
          return res
        })
        .catch((e) => {
          if (e.response) {
            return e.response
          } else {
            return e
          }
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    },
    createData({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        ...data,
      }

      return axios
        .post('/api/category/post', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const data = res.data
          if (data.status === 'ok') {
            commit('SET_MESSAGE_DATA', data.message)
          } else {
            commit('SET_MESSAGE_DATA', data.message)
          }
          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_FORM', false)
        })
    },
    updateData({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        shopId: data.shopId,
        name: data.name,
        status: data.status,
        description: data.description
      }

      return apiv2
        .put(`/api/categories/${data.id}`, params)
        .then((res) => {
          return res.data
        })
        .catch((e) => {
          if (e.response) {
            return e.response
          } else {
            return e
          }
        })
        .finally(() => {
          commit('SET_LOADING_FORM', false)
        })
    },
    deleteData({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        ...data,
      }

      return axios
        .post('/api/category/delete', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_FORM', false)
        })
    },
    uploadCover({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      let params = new FormData()
      params.append('image', data.image)

      return apiv2
        .post(`/api/categories/${data.id}/upload-image?shopId=${data.shopId}`, params, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          const payload = res.data
          return payload
        })
        .catch((e) => {
          if (e.response) {
            return e.response
          } else {
            return e
          }
        })
        .finally(() => {
          commit('SET_LOADING_FORM', false)
        })
    },
  },
}
