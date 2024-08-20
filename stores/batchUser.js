import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useBatchUserStore = defineStore('batchUser', {
    state: () => ({
        batchUsers: [],
        loading: false
    }),
    getters: {
        items: (state) => {
            return state.batchUsers
        },
        isLoading: (state) => {
            return state.loading
        }
    },
    actions: {
        async fetchBatchUsers() {
            this.loading = true
            const route = useRoute();
            const batch_id = route.params.id;
            const {data, pending, error, refresh} = await getData(`/admin/batch/${batch_id}/users`)
            if (error && error.value) {
                console.log(error)
            } else {
                this.batchUsers = data?.value?.data || []
            }
            this.loading = false
        }
    }
})