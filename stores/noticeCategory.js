import {defineStore} from "pinia";
import {getData} from "~/composables/useRequest";

export const useNoticeCategoryStore = defineStore('noticeCategory', {
  state: () => ({
    categories: [],
    allCategories: [],
    loading: false
  }),
  getters: {
    items: (state) => {
      return state.categories
    },
    allItems: (state) => {
        return state.allCategories
    },
    isLoading: (state) => {
      return state.loading
    }
  },
  actions: {
    addCategory(category) {
      this.categories.unshift(category)
    },
    updateCategory(category) {
      const index = this.categories.findIndex(item => item.id === category.id)
      if (index !== -1) {
        Object.assign(this.categories[index], category)
      }
    },
    removeCategory(id) {
      const index = this.categories.findIndex(item => item.id === id)
      if (index !== -1) {
        this.categories.splice(index, 1)
      }
    },
    async fetchCategories() {
      this.loading = true
      const {data, pending, error, refresh} = await getData('/admin/notice-categories')
      if (error && error.value) {
        console.log(error)
      } else {
        this.categories = data?.value?.data || []
      }
      this.loading = false
    }
  }
})