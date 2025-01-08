<template>
  <div id="AppListMenu">
    <ul
      :class="
        isSidebarSmall
          ? 'content-scroll menu-list hover with-icon'
          : 'content-scroll menu-list hover with-big-icon' +
            ` ${enableResponsive ? 'mobile-menu-list' : ''}`
      "
    >
      <li
        v-for="(parent, index) in dataSideBar"
        :key="index"
        :class="'ml-list'"
      >
        <router-link
          v-if="!parent.menu"
          :to="{ name: parent.link }"
          class="ml-link"
          :title="parent.label"
          exact
        >
          <div class="ml-icon">
            <i :class="parent.icon" />
          </div>
          <div class="ml-label">
            {{ parent.label }}
          </div>
          <div class="val-container">
            <div v-if="parent.value" class="ml-value">
              {{ parent.value }}
            </div>
          </div>
        </router-link>
        <div v-if="parent.menu" class="submenu">
          <div v-if="!parent.disableMenu" class="sublist">
            <div class="sublabel">
              {{ parent.label }}
            </div>
          </div>
          <ul v-if="parent.menu.length > 0" class="subcontent">
            <li
              v-for="(child, index) in parent.menu"
              :key="index"
              class="ml-list"
            >
              <div v-if="!child.menu" @click="onClick">
                <router-link
                  :to="{ name: child.link }"
                  :title="child.label"
                  class="ml-link"
                >
                  <div class="ml-icon" exact>
                    <i :class="child.icon" />
                  </div>
                  <div class="ml-label">
                    {{ child.label }}
                  </div>
                  <div class="val-container">
                    <div v-if="child.value" class="ml-value">
                      {{ child.value }}
                    </div>
                  </div>
                </router-link>
              </div>
              <div v-else>
                <AppListSubMenu :data="child" @onClick="onClick" />
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import AppListSubMenu from './AppListSubMenu'

export default {
  name: 'AppListMenu',
  data() {
    return {
      sidebar: [],
    }
  },
  components: {
    AppListSubMenu,
  },
  methods: {
    onClick() {
      this.$emit('onClick')
    },
    onCheckSubmenus(data) {
      let menu = []
      data &&
        data.map((dt) => {
          const stt = this.onCheckPermission(dt.permission)
          if (stt) {
            menu.push({
              ...dt,
            })
          }
        })
      return menu
    },
    onCheckPermission(value) {
      let stt = false
      let data = []
      try {
        data = JSON.parse(this.permissions)
      } catch (error) {
        data = this.permissions
      }
      if (data && data.length > 0) {
        const isTherePermission = data.find(
          (item) => item.permission_name === value
        )
        if (isTherePermission) {
          stt = true
        }
      }
      return stt
    },
  },
  computed: {
    permissions() {
      return this.$cookies.get('permissions')
    },
    dataSideBar() {
      let menu = []
      this.data &&
        this.data.map((dt) => {
          if (dt.menu) {
            let submenu = this.onCheckSubmenus(dt.menu)
            if (submenu.length > 0) {
              let submenuPayload = []
              submenu &&
                submenu.map((sb) => {
                  submenuPayload.push({ ...sb })
                })
              if (submenuPayload.length > 0) {
                menu.push({
                  ...dt,
                  menu: submenuPayload,
                })
              }
            }
          }
        })
      return menu
    },
  },
  props: {
    enableResponsive: {
      type: Boolean,
      required: false,
    },
    isSidebarSmall: {
      type: Boolean,
      required: false,
    },
    data: {
      type: [Array, String],
      required: true,
    },
  },
}
</script>
