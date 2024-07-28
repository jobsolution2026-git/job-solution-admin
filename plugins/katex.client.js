import "katex/dist/katex.min.css";
import katexvue3 from "katex-vue3";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(katexvue3, {
        flag: [
            { left: "$", right: "$" },
            { left: "$$", right: "$$" },
        ],
        options: {
            displayMode: false,
            throwOnError: false,
            errorColor: "#FF0000",
        },
        compatible: true,
        compatibleConfig: {
            "{align}": "{aligned}",
        },
    });
});
