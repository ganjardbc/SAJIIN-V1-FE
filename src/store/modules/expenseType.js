import axios from 'axios'

const defaultMessage = () => {
  return {
    id: '',
    expense_type_id: '',
    image: '',
    name: '',
    status: '',
    description: '',
    shop_id: '',
  }
}

const defaultForm = () => {
  return {
    id: '',
    expense_type_id: '',
    image: '',
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
          expense_type_id: `ET-${time}`,
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
        limit: state.limit,
        offset: state.offset,
        search: state.filter.search,
        status: state.filter.status,
        shop_id: data.shop_id,
      }

      return axios
        .post('/api/expense-type/getAll', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const payload = res.data.data

          payload &&
            payload.map((dt) => {
              dataPrev.push({ ...dt })
            })

          commit('SET_DATA', dataPrev)
          commit('SET_TOTAL_RECORD', res.data.total_record)

          return res
        })
        .catch((e) => {
          console.log('error', e)
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
        .post('/api/expense-type/post', params, {
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
        ...data,
      }

      return axios
        .post('/api/expense-type/update', params, {
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
    deleteData({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        ...data,
      }

      return axios
        .post('/api/expense-type/delete', params, {
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
      params.append('expense_type_id', data.expense_type_id)
      params.append('image', data.image)

      return axios
        .post('/api/expense-type/uploadImage', params, {
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
  },
}
