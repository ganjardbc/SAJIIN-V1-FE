export default {
  namespaced: true,

  state: {
    isBluetoothSupported: false,
    updateApplication: false,
    deviceType: 'desktop', // 'desktop', 'tablet' or 'mobile'
  },

  getters: {},

  mutations: {
    SET_UPDATE_APPLICATION(state, value) {
      state.updateApplication = value
    },
    SET_BLUETOOTH_SUPPORTED(state, value) {
      state.isBluetoothSupported = value
    },
    SET_DEVICE_TYPE(state, value) {
      state.deviceType = value
    },
  },

  actions: {
    setUpdateApplication({ commit }, data) {
      commit('SET_UPDATE_APPLICATION', data)
    },
    setBluetoothSupported({ commit }, data) {
      commit('SET_BLUETOOTH_SUPPORTED', data)
    },
    setDeviceType({ commit }, data) {
      commit('SET_DEVICE_TYPE', data)
    },
  },
}
