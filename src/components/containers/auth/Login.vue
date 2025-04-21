<template>
  <div
    id="Login"
    class="px-sm w-1/3"
    style="width: 420px"
    v-loading="loading"
  >
    <div class="px-6 py-8 rounded-lg shadow-md bg-white">
      <div class="w-full flex items-center justify-between">
        <div class="text-3xl text-black font-semibold">
          Login
        </div>
        <img :src="logo" alt="" style="width: 120px" />
      </div>

      <form
        action="#"
        @submit.prevent="submit"
        class="flex flex-col gap-4 py-6"
      >
        <div class="flex flex-col gap-4">
          <div class="field-group">
            <div class="field-label">Username</div>
            <el-input
              placeholder="Username"
              type="text"
              v-model="form.username"
              :disabled="loading"
              rounded
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
            <div v-if="errorMessage.username" class="field-error">
              {{ errorMessage.username }}
            </div>
          </div>

          <div class="field-group">
            <div class="field-label">Password</div>
            <el-input
              placeholder="Pasword"
              type="password"
              v-model="form.password"
              :disabled="loading"
              show-password
              rounded
            >
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
            <div v-if="errorMessage.password" class="field-error">
              {{ errorMessage.password }}
            </div>
          </div>

          <el-button
            class="w-full"
            type="primary"
            :disabled="isButtonDisabled"
            @click="submit">
            Login
          </el-button>
        </div>
      </form>

      <div class="text-sm text-gray-500 text-center pt-2">{{ appVersion }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import logo from '@/assets/img/logo.png'

export default {
  name: 'Login',

  metaInfo: {
    title: 'SAJI-IN',
    titleTemplate: '%s | Serve All You Want',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },

  components: {},

  data() {
    return {
      logo: logo,
    }
  },

  mounted() {},

  computed: {
    ...mapState({
      form: (state) => state.storeAuth.form,
      errorMessage: (state) => state.storeAuth.errorMessage,
      loading: (state) => state.storeAuth.loading,
    }),
    isButtonDisabled() {
      let status = true
      if (this.form.username && this.form.password) {
        status = false
      }
      return status
    },
  },

  methods: {
    ...mapActions({
      login: 'storeAuth/login',
    }),

    async submit() {
      const res = await this.login(this.form)
      if (res.data.status === 'ok') {
        const data = res.data.data

        this.$cookies.set('token', data.token)
        this.$cookies.set('tokenBearer', `Bearer ${data.token}`)
        this.$cookies.set('user', data.user)
        this.$cookies.set('role', data.role)
        this.$cookies.set('shop', data.shop)
        this.$cookies.set('employee', data.employee)
        this.$cookies.set('permissions', JSON.stringify(data.permissions))

        if (data.user.role_name === 'admin') {
          this.$router.replace({ name: 'admin-home' })
        } else if (data.user.role_name === 'owner') {
          this.$router.replace({ name: 'owner-home' })
        } else {
          this.$store.state.storeSelectedShop.selectedData = data.shop.id
          this.$router.replace({ name: 'shop-home', params: { shopId: data.shop.shop_id } })
        }
      }
    },
  },
}
</script>
