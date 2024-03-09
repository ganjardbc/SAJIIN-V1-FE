<template>
  <div
    id="AppButtonCapsuleSlider"
    class="slider display-flex space-between align-center wrap"
  >
    <div class="horizontal-scroll" style="overflow-x: auto">
      <div
        v-if="!disableAll"
        style="margin: 10px 10px 5px 0; flex-grow: 1; display: inline-block"
      >
        <div
          :class="`card card-status ${selectedIndex === 'all' ? 'active' : 'normal'} no-padding border-big-radius`"
          style="margin: 0 0"
          @click="onSelected('all', 'active')"
        >
          <div
            class="display-flex nowrap align-center"
            style="padding: 5px 10px 5px 5px"
          >
            <div class="width width-35px">
              <div class="image image-30px image-circle bg-transparent">
                <i
                  :class="`post-middle-absolute fonts fonts-10 grey ${customIcon ? customIcon : 'fa fa-lw fa-check'}`"
                ></i>
              </div>
            </div>
            <div style="width: calc(100% - 35px)">
              <div class="fonts fonts-10 black semibold">
                {{ customAllLabel ? customAllLabel : 'Semua' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(dt, i) in filteredData"
        :key="i"
        style="
          position: relative;
          margin: 10px 13px 5px 0;
          flex-grow: 1;
          display: inline-block;
        "
      >
        <div
          :class="`
                        card 
                        card-status 
                        ${
                          dt.status === 'active'
                            ? selectedIndex === (returnIndex ? i : dt.id)
                              ? 'active'
                              : 'normal'
                            : 'disabled'
                        } 
                        no-padding 
                        border-big-radius
                    `"
          style="margin: 0 0"
          @click="onSelected(returnIndex ? i : dt.id, dt.status)"
        >
          <div class="display-flex">
            <div
              class="display-flex nowrap align-center"
              style="padding: 5px 10px 5px 5px"
            >
              <div class="width width-35px">
                <div class="image image-30px image-circle bg-transparent">
                  <img
                    v-if="dt.image"
                    :src="dt.image"
                    alt=""
                    class="post-center"
                  />
                  <i
                    v-else
                    :class="`post-middle-absolute fonts fonts-10 ${dt.status === 'active' ? 'black' : 'grey'} ${dt.icon ? dt.icon : 'fa fa-lw fa-check'}`"
                  ></i>
                </div>
              </div>
              <div
                style="width: calc(100% - 35px)"
                class="display-flex align-center"
              >
                <div
                  :class="`fonts fonts-10 semibold ${dt.status === 'active' ? 'black' : 'grey'}`"
                >
                  {{ dt.label }}
                </div>
                <div v-if="dt.value" class="card-value margin margin-left-10px">
                  {{ dt.value }}
                </div>
              </div>
            </div>
            <div v-if="enableEditButton" style="width: 20px"></div>
          </div>
        </div>
        <div
          v-if="enableEditButton"
          class="slider-edit display-flex column center align-center"
        >
          <button
            class="btn btn-small-icon btn-circle btn-sekunder"
            @click="onEdit(dt)"
          >
            <i class="icn fonts fonts-8 fa fa-lw fa-edit"></i>
          </button>
        </div>
      </div>
      <div
        v-if="enableCreateButton"
        style="width: 25px; flex-grow: 1; display: inline-block"
      ></div>
    </div>
    <div
      v-if="enableCreateButton"
      class="slider-create display-flex column center align-center"
    >
      <button
        class="btn btn-small-icon btn-circle btn-sekunder"
        @click="onCreate"
      >
        <i class="icn fa fa-lw fa-plus"></i>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppButtonCapsuleSlider',
  data() {
    return {
      selectedIndex: this.index || this.index === 0 ? this.index : 'all',
    }
  },
  mounted() {
    this.selectedIndex = this.index || this.index === 0 ? this.index : 'all'
  },
  props: {
    index: null,
    data: null,
    disableAll: false,
    returnIndex: false,
    customAllLabel: '',
    customIcon: '',
    enableCreateButton: false,
    enableEditButton: false,
  },
  watch: {
    index: function (props) {
      this.selectedIndex = props
    },
  },
  computed: {
    filteredData() {
      return (
        this.data &&
        this.data.map((item) => {
          return {
            ...item,
            status: item.status ? item.status : 'active',
          }
        })
      )
    },
  },
  methods: {
    onSelected(id, status) {
      if (status === 'active') {
        if (id === 'all') {
          this.$emit('onChange', 'all')
        } else {
          this.$emit('onChange', id)
        }
      }
    },
    onEdit(data) {
      this.$emit('onEdit', data)
    },
    onCreate() {
      this.$emit('onCreate')
    },
  },
}
</script>
