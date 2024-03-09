<template>
  <div id="App">
    <div class="card-check-out-fixed">
      <div class="card small-padding box-shadow bg-white">
        <div class="display-flex align-center">
          <div style="width: 50px">
            <button
              class="btn btn-icon btn-circle btn-white-grey"
              @click="onClick"
            >
              <i
                class="post-top icn fa fa-lw fa-shopping-cart fonts main-color"
              ></i>
              <span v-if="orderQuantity" class="notif">{{
                orderQuantity
              }}</span>
            </button>
          </div>
          <div style="width: calc(100% - 90px)">
            <div class="fonts fonts-10 black">Keranjang</div>
            <div class="display-flex">
              <span class="fonts fonts-10 semibold black"
                >{{ orderQuantity }} Produk</span
              >
              <span class="fonts black" style="margin: 0 3px">|</span>
              <span class="fonts fonts-10 black semibold">{{
                format(orderPrice)
              }}</span>
            </div>
          </div>
          <div style="width: 40px">
            <button class="btn btn-icon btn-circle btn-white" @click="onClick">
              <i class="fa fa-lw fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      form: (state) => state.storeCashier.form,
      details: (state) => state.storeCashier.form.details,
    }),
    orderQuantity() {
      let quantity = 0
      this.details &&
        this.details.map((item) => {
          quantity += item.quantity
        })
      return quantity
    },
    orderPrice() {
      let price = 0
      this.details &&
        this.details.map((item) => {
          let quantity = item.quantity
          price += quantity * item.price
        })
      return price
    },
    isThereDetails() {
      return this.details.length > 0
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick')
    },
  },
}
</script>
