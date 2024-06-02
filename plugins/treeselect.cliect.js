import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("treeselect", Treeselect);
});