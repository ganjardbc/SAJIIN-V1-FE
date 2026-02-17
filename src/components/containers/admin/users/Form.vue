<template>
  <AppSideForm
    :title="title"
    :value="openForm"
    :enableSaveButton="!isDetailForm"
    @save="onSave"
    @close="onClose"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <div class="text-md text-black font-semibold">Informasi</div>
        <div class="field-group">
          <div class="field-label">Cover</div>
          <AppCardAvatar
            :src="getCover"
            size="medium"
            shape="square"
          />
        </div>
        <div class="field-group">
          <div class="field-label">ID User</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.id" class="field-error">
            {{ errorMessage.id && errorMessage.id[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Role</div>
          <el-select
            v-model="form.role_id"
            placeholder="Pilih"
            no-data-text="Data Tidak Ditemukan"
            :disabled="isDetailForm"
            clearable
          >
            <el-option
              v-for="(item, i) in roleData"
              :key="i"
              :label="item.description"
              :value="item.id"
              style="text-transform: capitalize"
            >
            </el-option>
          </el-select>
          <div v-if="errorMessage.role_id" class="field-error">
            {{ errorMessage.role_id && errorMessage.role_id[0] }}
          </div>
        </div>
        <div v-if="isUserEmployee" class="field-group">
          <div class="field-label">Karyawan (opsional)</div>
          <el-select
            v-model="form.owner_id"
            placeholder="Pilih"
            no-data-text="Data Tidak Ditemukan"
            :disabled="isDetailForm"
            clearable
          >
            <el-option
              v-for="(item, i) in employeeData"
              :key="i"
              :label="`${item.employee.name} (${item.role.description})`"
              :value="item.employee.id"
              class="custom-field-select-employee"
            >
              <div
                class="fonts fonts-10 black semibold custom-field-select-title"
              >
                {{ item.employee.name }}
              </div>
              <div class="flex justify-between items-center">
                <span class="fonts fonts-10 grey custom-field-select-caption">{{
                  item.role.description
                }}</span>
                <span class="fonts fonts-10 grey custom-field-select-caption">{{
                  item.employee.employee_id
                }}</span>
              </div>
            </el-option>
          </el-select>
          <div v-if="errorMessage.owner_id" class="field-error">
            {{ errorMessage.owner_id && errorMessage.owner_id[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Nama</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.name"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.name" class="field-error">
            {{ errorMessage.name && errorMessage.name[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Email</div>
          <el-input
            placeholder=""
            type="email"
            v-model="form.email"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.email" class="field-error">
            {{ errorMessage.email && errorMessage.email[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Username</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.username"
            :disabled="isDetailForm"
            @input="onChangeUsername"
          ></el-input>
          <div v-if="errorMessage.username" class="field-error">
            {{ errorMessage.username && errorMessage.username[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Password</div>
          <div class="field-caption">
            Masukan password untuk merubah atau menambahkan
          </div>
          <el-input
            placeholder=""
            type="password"
            v-model="form.password"
            :disabled="isDetailForm"
            show-password
          ></el-input>
          <div v-if="errorMessage.password" class="field-error">
            {{ errorMessage.password && errorMessage.password[0] }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="text-md text-black font-semibold">Konfigurasi</div>
        <div class="field-group">
          <div class="flex justify-between items-center">
            <div class="field-label">Status</div>
            <el-switch
              v-model="form.status"
              :disabled="isDetailForm"
              active-text="Aktif"
              inactive-text="Non-Aktif"
              :active-value="'active'"
              :inactive-value="'inactive'"
            ></el-switch>
          </div>
          <div v-if="errorMessage.status" class="field-error">
            {{ errorMessage.status && errorMessage.status[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="flex justify-between items-center">
            <div class="field-label">Available</div>
            <el-switch
              v-model="form.is_available"
              :disabled="isDetailForm"
              active-text="Available"
              inactive-text="Non-Available"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </div>
          <div v-if="errorMessage.is_available" class="field-error">
            {{ errorMessage.is_available && errorMessage.is_available[0] }}
          </div>
        </div>
      </div>
    </div>
  </AppSideForm>
</template>

<script>
import { mapState } from 'vuex'
import AppSideForm from '../../../modules/AppSideForm'
import AppImage from '../../../modules/AppImage'
import AppCardAvatar from '../../../modules/AppCardAvatar'

export default {
  name: 'App',
  data() {
    return {}
  },
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeUsers.form,
      errorMessage: (state) => state.storeUsers.errorMessage,
      typeForm: (state) => state.storeUsers.typeForm,
      roleData: (state) => state.storeUsers.role.data,
      employeeData: (state) => state.storeUsers.employee.data,
    }),
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Tambah User'
          break
        case 'detail':
          currentTitle = 'Detail User'
          break
        case 'edit':
          currentTitle = 'Edit User'
          break
      }
      return currentTitle
    },
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
    isUserEmployee() {
      let status = false
      let role = this.roleData.find((item) => item.id === this.form.role_id)
      if (role !== undefined) {
        if (role.role_name !== 'admin' && role.role_name !== 'owner') {
          status = true
        }
      }
      return status
    },
    getCover() {
      return this.form.image
        ? this.adminImageThumbnailUrl + this.form.image
        : ''
    },
  },
  components: {
    AppSideForm,
    AppImage,
    AppCardAvatar,
  },
  methods: {
    onChangeUsername(value) {
      this.form.username = value.replace(/[ ]/g, '_')
    },
    uploadImage(data) {
      this.$emit('uploadImage', data)
    },
    removeImage(data) {
      this.$emit('removeImage', data)
    },
    onSave() {
      this.$emit('onSave')
    },
    onClose() {
      this.$emit('onClose')
    },
  },
}
</script>
<style>
.custom-field-select-employee {
  height: auto;
  padding: 7px 20px;
}
.custom-field-select-employee.selected {
  background-color: #f5f7fa;
}
.custom-field-select-employee.selected .custom-field-select-title {
  color: #409eff;
  font-weight: bold;
}
.custom-field-select-employee.selected .custom-field-select-caption {
  color: #151f2d;
  font-weight: normal;
}
</style>
