<template>
  <div id="App">
    <div class="margin margin-bottom-20px">
      <div class="fonts fonts-13 black semibold">Informasi</div>
      <div class="field-group">
        <div class="field-label">ID Role</div>
        <el-input
          placeholder=""
          type="text"
          v-model="form.role_id"
          :disabled="true"
        ></el-input>
        <div v-if="errorMessage.role_id" class="field-error">
          {{ errorMessage.role_id && errorMessage.role_id[0] }}
        </div>
      </div>
      <div class="field-group">
        <div class="field-label">Nama</div>
        <el-input
          placeholder=""
          type="text"
          v-model="form.role_name"
          :disabled="isDetailForm"
        ></el-input>
        <div v-if="errorMessage.role_name" class="field-error">
          {{ errorMessage.role_name && errorMessage.role_name[0] }}
        </div>
      </div>
      <div class="field-group">
        <div class="field-label">Keterangan</div>
        <el-input
          placeholder=""
          type="textarea"
          v-model="form.description"
          :disabled="isDetailForm"
          :autosize="{ minRows: 2, maxRows: 2 }"
        ></el-input>
        <div v-if="errorMessage.description" class="field-error">
          {{ errorMessage.description && errorMessage.description[0] }}
        </div>
      </div>
      <div class="field-group">
        <div class="field-label">Type</div>
        <el-select
          v-model="form.type"
          placeholder="Select"
          no-data-text="Data Tidak Ditemukan"
          :disabled="isDetailForm"
          clearable
        >
          <el-option
            v-for="(item, i) in typeLists"
            :key="i"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div v-if="errorMessage.type" class="field-error">
          {{ errorMessage.type && errorMessage.type[0] }}
        </div>
      </div>
    </div>
    <div class="margin margin-bottom-0px">
      <div class="fonts fonts-13 black semibold">Konfigurasi</div>
      <div class="field-group">
        <div class="display-flex space-between">
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
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      form: (state) => state.storeRoles.form,
      errorMessage: (state) => state.storeRoles.errorMessage,
      typeForm: (state) => state.storeRoles.typeForm,
      typeLists: (state) => state.storeRoles.typeLists,
    }),
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
  },
}
</script>
