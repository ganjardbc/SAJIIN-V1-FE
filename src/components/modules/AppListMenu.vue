<template>
  <ul
    class="default-menu"
    :class="{
      'collapse': isCollapse,
    }"
  >
    <li
      v-for="(parent, index) in dataSideBar"
      :key="index"
    >
      <router-link
        :to="{ name: parent.link }"
        :title="parent.label"
        class="menu-item"
      >
        <div class="icon" style="width: 22px" exact>
          <i class="text-sm" :class="parent.icon" />
        </div>
        <div class="label">
          {{ parent.label }}
        </div>
        <AppCardCapsule
          v-if="parent.value"
          :label="parent.value"
          size="small"
        />
      </router-link>
    </li>
  </ul>
</template>
<script>
import AppListSubMenu from './AppListSubMenu'
import AppCardCapsule from './AppCardCapsule'

export default {
  name: 'AppListMenu',
  data() {
    return {
      sidebar: [],
    }
  },
  components: {
    AppListSubMenu,
    AppCardCapsule,
  },
  methods: {
    onClick() {
      this.$emit('onClick')
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
          const stt = this.onCheckPermission(dt.permission)
          if (stt) {
            menu.push({
              ...dt,
            })
          }
        })
      return menu
    },
  },
  props: {
    isCollapse: {
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
