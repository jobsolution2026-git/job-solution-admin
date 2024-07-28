import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        loading: false
    }),
    getters: {
        filterForSelect: (state) => {
            return state.users.map(item => {
                return {
                    value: item.id,
                    label: item.name || 'unknown'
                }
            })
        },
    },
    actions: {
        async fetchUsers() {
            this.loading = true
            const {data, pending, error, refresh} = await getData('/admin/users')
            if (error && error.value) {
                console.log(error)
            } else {
                this.users = data?.value?.data || []
            }
            this.loading = false
        }
    }
})