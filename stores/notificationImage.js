import { defineStore } from 'pinia'
import { getData } from '~/composables/useRequest'

export const useNotificationImageStore = defineStore('notificationImage', {
  state: () => ({
    images: [],
    loading: false
  }),
  getters: {
    items: (state) => state.images,
    isLoading: (state) => state.loading
  },
  actions: {
    addImage(image) {
      this.images.unshift(image)
    },
    updateImage(image) {
      const index = this.images.findIndex(item => item.id === image.id)
      if (index !== -1) {
        Object.assign(this.images[index], image)
      }
    },
    removeImage(id) {
      const index = this.images.findIndex(item => item.id === id)
      if (index !== -1) {
        this.images.splice(index, 1)
      }
    },
    async fetchImages() {
      this.loading = true
      const { data, error } = await getData('/admin/notification-images')
      if (error && error.value) {
        console.error('Failed to fetch notification images:', error)
      } else {
        this.images = data?.value?.data || []
      }
      this.loading = false
    }
  }
})
