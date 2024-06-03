import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptions: [],
    loading: false
  }),
  getters: {
    items: (state) => {
      return state.subscriptions
    },
    isLoading: (state) => {
      return state.loading
    }
  },
  actions: {
    addSubscription(Subscription) {
      this.subscriptions.unshift(Subscription)
    },
    updateSubscription(Subscription) {
      const index = this.subscriptions.findIndex(item => item.id === Subscription.id)
      if (index !== -1) {
        Object.assign(this.subscriptions[index], Subscription)
      }
    },
    removeSubscription(id) {
      const index = this.subscriptions.findIndex(item => item.id === id)
      if (index !== -1) {
        this.subscriptions.splice(index, 1)
      }
    },
    async fetchSubscriptiones() {
      this.loading = true
      const {data, pending, error, refresh} = await getData('/admin/subscriptions')
      if (error && error.value) {
        console.log(error)
      } else {
        this.subscriptions = data?.value?.data || []
      }
      this.loading = false
    }
  }
})