<template>
  <div id="App">
    <AppHeaderMobile title="Log Aktifitas" />

    <div class="width width-100">
      <div
        class="display-flex space-between display-mobile margin margin-bottom-15px"
      >
        <div class="width width-75 width-mobile display-flex space-between">
          <h1 class="fonts big black bold">Log Aktifitas</h1>
          <button class="btn btn-icon btn-white" @click="onRefresh">
            <i class="fa fa-lw fa-retweet"></i>
          </button>
        </div>
        <div class="width width-25 width-mobile">
          <SearchField
            :placeholder="'Cari log aktifitas ..'"
            :enableResponsive="true"
            :onChange="(data) => onSearch(data)"
          />
        </div>
      </div>

      <div class="padding padding-bottom-15px">
        <h1 class="fonts big black bold">Lainnya</h1>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
import SearchField from '../../../modules/SearchField'

export default {
  name: 'App',
  data() {
    return {
      listOfData: [],
    }
  },
  components: {
    AppHeaderMobile,
    SearchField,
  },
  methods: {
    onRefresh() {
      this.$store.dispatch('logActivities/getData')
    },
    onSearch(data) {
      this.$store.dispatch('logActivities/getData', {
        search: data,
      })
    },
  },
};
</script>