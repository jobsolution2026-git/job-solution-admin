import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    coupons: [],
    loading: false
  }),
  getters: {
    items: (state) => {
      return state.coupons
    },
    isLoading: (state) => {
      return state.loading
    }
  },
  actions: {
    addCoupon(Coupon) {
      this.coupons.unshift(Coupon)
    },
    updateCoupon(Coupon) {
      const index = this.coupons.findIndex(item => item.id === Coupon.id)
      if (index !== -1) {
        Object.assign(this.coupons[index], Coupon)
      }
    },
    removeCoupon(id) {
      const index = this.coupons.findIndex(item => item.id === id)
      if (index !== -1) {
        this.coupons.splice(index, 1)
      }
    },
    async fetchCoupons() {
      this.loading = true
      const {data, pending, error, refresh} = await getData('/admin/coupon')
      if (error && error.value) {
        console.log(error)
      } else {
        this.coupons = data?.value?.data || []
      }
      this.loading = false
    }
  }
})