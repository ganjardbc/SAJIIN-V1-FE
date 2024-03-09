import axios from 'axios'

const defaultDayLists = () => {
  return ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
}

const defaultMessage = () => {
  return {
    id: '',
    payment_id: '',
    image: '',
    name: '',
    status: '',
    description: '',
  }
}
const defaultForm = () => {
  return {
    id: '',
    payment_id: '',
    image: '',
    name: '',
    status: 'active',
    description: '',
  }
}

export default {
  namespaced: true,

  state: {
    form: defaultForm(),
    errorMessage: defaultMessage(),
    dayLists: defaultDayLists(),
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
      status: '',
    },
    field: {
      limit: 10,
      offset: 0,
      totalRecord: 0,
      loading: false,
      data: [],
      filter: {
        search: '',
        status: 'active',
      },
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
          payment_id: `PM-${time}`,
          status: 'active',
          is_available: 1,
        }
      }
    },
    SET_TOTAL_RECORD(state, value) {
      state.totalRecord = value
    },

    // FIELD
    SET_FIELD_LOADING(state, value) {
      state.field.loading = value
    },
    SET_FIELD_OFFSET(state, value) {
      state.field.offset += value
    },
    SET_FIELD_DATA(state, value) {
      state.field.data = value
    },
    SET_FIELD_TOTAL_RECORD(state, value) {
      state.field.totalRecord = value
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
      commit('SET_LOAD_MORE', false)

      let dataPrev = []

      const params = {
        limit: state.limit,
        offset: state.offset,
        search: state.filter.search,
        status: state.filter.status,
      }

      return axios
        .post('/api/payment/getAll', params, {
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

          if (payload.length < state.limit) {
            commit('SET_LOAD_MORE', false)
          } else {
            commit('SET_LOAD_MORE', true)
          }

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
        .post('/api/payment/post', params, {
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
        .post('/api/payment/update', params, {
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
        .post('/api/payment/delete', params, {
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
      params.append('payment_id', data.payment_id)
      params.append('image', data.image)

      return axios
        .post('/api/payment/uploadImage', params, {
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

    // FIELD
    setFieldPagination({ commit, state }, data) {
      state.field.offset = (data - 1) * state.field.limit
    },
    resetFieldFilter({ commit, state }) {
      state.field.limit = 10
      state.field.offset = 0
    },
    getFieldData({ commit, state }, data) {
      commit('SET_FIELD_LOADING', true)

      let dataPrev = []

      const params = {
        limit: state.field.limit,
        offset: state.field.offset,
        search: state.field.filter.search,
        status: state.field.filter.status,
        shop_id: data.shop_id,
      }

      return axios
        .post('/api/payment/getAll', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const payload = res.data.data

          payload &&
            payload.map((dt) => {
              dataPrev.push({ ...dt })
            })

          commit('SET_FIELD_DATA', dataPrev)
          commit('SET_FIELD_TOTAL_RECORD', res.data.total_record)

          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_FIELD_LOADING', false)
        })
    },
  },
}
