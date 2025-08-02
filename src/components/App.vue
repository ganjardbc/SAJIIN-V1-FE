<template>
  <div id="app">
    <ReloadApp
      v-if="updateApplication"
      @closeReload="closeReload"
      @reloadApplication="reloadApplication"
    />
    <router-view />
    <div id="portal-modal"></div>
    <div id="portal-slider"></div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ReloadApp from './ReloadApp'

export default {
  name: 'app',
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    }
  },
  components: {
    ReloadApp,
  },
  computed: {
    ...mapState({
      updateApplication: (state) => state.application.updateApplication,
    }),
  },
  methods: {
    ...mapActions({
      setDeviceType: 'application/setDeviceType',
      setUpdateApplication: 'application/setUpdateApplication',
      setBluetoothSupported: 'application/setBluetoothSupported',
    }),
    handleResize() {
      this.windowWidth = window.innerWidth

      if (this.windowWidth <= 768) {
        this.setDeviceType('mobile')
      } else if (this.windowWidth <= 1024) {
        this.setDeviceType('tablet')
      } else {
        this.setDeviceType('desktop')
      }
    },
    reloadApplication() {
      this.setUpdateApplication(false)
      window.location.reload()
    },
    closeReload() {
      this.setUpdateApplication(false)
    },
    addUserSocket() {
      const data = this.$cookies.get('user')
      const token = this.$cookies.get('token')
      if (data && token) {
        const payload = {
          id: data.id,
          name: data.name,
          roleName: data.role_name,
          email: data.email,
          token: token,
        }
        this.$socket.emit('addUser', payload)
      }
    },
    setUpNotification() {
      if (!('Notification' in window)) {
        this.$message({
          message: 'This browser does not support desktop notification',
          type: 'error',
        })
      } else {
        if (Notification.permission === 'denied') {
          this.$message({
            message: 'This browser disabled the desktop notification',
            type: 'error',
          })

          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              this.$message({
                message: 'You allowed the notifications',
                type: 'info',
              })
            } else {
              this.$message({
                message: 'You blocked the notifications',
                type: 'error',
              })
            }
          })
        }
      }
    },
    setUpNewUpdate() {
      if (this.$workbox) {
        this.$workbox.addEventListener('installed', (event) => {
          if (event.isUpdate) {
            this.setUpdateApplication(true)
          } else {
            this.setUpdateApplication(false)
          }
        })
      }
    },
    onCheckBluetooth() {
      navigator.bluetooth.getAvailability().then((available) => {
        if (available) {
          this.setBluetoothSupported(true)
        } else {
          this.$message({
            message: 'This browser does not support Bluetooth.',
            type: 'error',
          })
          this.setBluetoothSupported(false)
        }
      })
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)

    this.setUpNotification()
    this.setUpNewUpdate()
    this.onCheckBluetooth()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  sockets: {
    connect: function () {
      this.$message('Your are connected')
      this.addUserSocket()
    },
    disconnect: function () {
      this.$message({
        message: 'Your are disconnected',
        type: 'error',
      })
    },
  },
}
</script>
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
@import 'element-ui/lib/theme-chalk/index.css';
@import '../assets/css/app.css';
</style>
