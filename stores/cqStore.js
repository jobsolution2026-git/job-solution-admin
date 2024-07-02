import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useCqStore = defineStore('cqStore', {
    state: () => ({
        cqStores: [],
        allCqStores: [],
        isLoading: false
    }),
    getters: {
        items: (state) => {
            return state.cqStores
        },
        allStores: (state) => {
            return state.allCqStores
        }
    },
    actions: {
        addCqStore(cqStore) {
            this.cqStores.push(cqStore)
        },
        updateCqStore(cqStore) {
            const index = this.cqStores.findIndex(item => item.id === cqStore.id)
            if (index !== -1) {
                Object.assign(this.cqStores[index], cqStore)
            }
        },
        removeCqStore(id) {
            const index = this.cqStores.findIndex(item => item.id === id)
            if (index !== -1) {
                this.cqStores.splice(index, 1)
            }
        },
        async fetchItems() {
            this.isLoading = true
            const {data, pending, error, refresh} = await getData('admin/cq-stores')
            if (error && error.value) {
                console.log(error)
            } else {
                this.cqStores = data?.value?.data || []
            }
            this.isLoading = false
        },
        async fetchAllStores() {
            this.isLoading = true
            const {data, pending, error, refresh} = await getData('admin/cq-stores/all')
            if (error && error.value) {
                console.log(error)
            } else {
                this.allCqStores = data?.value?.data || []
            }
            this.isLoading = false
        }
    }
})