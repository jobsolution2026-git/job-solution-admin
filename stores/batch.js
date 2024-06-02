import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useBatchStore = defineStore('batch', {
  state: () => ({
    batches: [],
    loading: false
  }),
  getters: {
    items: (state) => {
      return state.batches
    },
    batchNameById: (state) => (id) => {
        const batch = state.batches.find(item => item.id === id)
        return batch ? batch.name : ''
    },
    filterForSelect: (state) => {
      return state.batches.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    },
    isLoading: (state) => {
      return state.loading
    }
  },
  actions: {
    addBatch(batch) {
      this.batches.unshift(batch)
    },
    updateBatch(batch) {
      const index = this.batches.findIndex(item => item.id === batch.id)
      if (index !== -1) {
        Object.assign(this.batches[index], batch)
      }
    },
    removeBatch(id) {
      const index = this.batches.findIndex(item => item.id === id)
      if (index !== -1) {
        this.batches.splice(index, 1)
      }
    },
    async fetchBatches() {
      this.loading = true
      const {data, pending, error, refresh} = await getData('/admin/batches')
      if (error && error.value) {
        console.log(error)
      } else {
        this.batches = data?.value?.data || []
      }
      this.loading = false
    }
  }
})