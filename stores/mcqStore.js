import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useMcqStore = defineStore('mcqStore', {
    state: () => ({
        mcqStores: [],
        allMcqStores: [],
        isLoading: false
    }),
    getters: {
        items: (state) => {
            return state.mcqStores
        },
        allStores: (state) => {
            return state.allMcqStores
        }
    },
    actions: {
        addMcqStore(mcqStore) {
            this.mcqStores.push(mcqStore)
        },
        updateMcqStore(mcqStore) {
            const index = this.mcqStores.findIndex(item => item.id === mcqStore.id)
            if (index !== -1) {
                Object.assign(this.mcqStores[index], mcqStore)
            }
        },
        removeMcqStore(id) {
            const index = this.mcqStores.findIndex(item => item.id === id)
            if (index !== -1) {
                this.mcqStores.splice(index, 1)
            }
        },
        async fetchItems() {
            this.isLoading = true
            const {data, pending, error, refresh} = await getData('admin/mcq-stores')
            if (error && error.value) {
                console.log(error)
            } else {
                this.mcqStores = data?.value?.data || []
            }
            this.isLoading = false
        },
        async fetchAllStores() {
            this.isLoading = true
            const {data, pending, error, refresh} = await getData('admin/mcq-stores/all')
            if (error && error.value) {
                console.log(error)
            } else {
                this.allMcqStores = data?.value?.data || []
            }
            this.isLoading = false
        }
    }
})