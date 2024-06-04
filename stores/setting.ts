import {defineStore} from "pinia";
import type {Setting} from "~/interfaces/setting";

export const useSettingStore = defineStore('setting', () => {

    const settings = ref(<Setting>undefined)

    return {settings}
})