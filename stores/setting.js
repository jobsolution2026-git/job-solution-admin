import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useSettingStore = defineStore('setting', {
    state: () => ({
        settings: [],
        loading: false
    }),
    getters: {
        items: (state) => {
            return state.settings
        },
        isLoading: (state) => {
            return state.loading
        }
    },
    actions: {
        addSetting(Setting) {
            this.settings.unshift(Setting)
        },
        updateSetting(Setting) {
            const index = this.settings.findIndex(item => item.id === Setting.id)
            if (index !== -1) {
                Object.assign(this.settings[index], Setting)
            }
        },
        removeSetting(id) {
            const index = this.settings.findIndex(item => item.id === id)
            if (index !== -1) {
                this.settings.splice(index, 1)
            }
        },
        async fetchSettings() {
            this.loading = true
            const {data, pending, error, refresh} = await getData('/admin/settings')
            if (error && error.value) {
                console.log(error)
            } else {
                this.settings = data?.value?.data || []
            }
            this.loading = false
        }
    }
})