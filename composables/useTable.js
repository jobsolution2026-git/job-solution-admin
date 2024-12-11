import { ref, computed, watch } from 'vue';

export function useTable(items, searchKey = 'name') {
    const itemsPerPage = ref(100);
    const itemsPerPageOptions = [10, 25, 50, 100];
    const currentPage = ref(1);
    const startItem = ref(0);
    const endItem = ref(0);
    const search = ref('');

    const filteredItems = computed(() => {
        if (!search.value) return items.value;
        return items.value.filter(item => item[searchKey].toLowerCase().includes(search.value.toLowerCase()));
    });

    const totalItems = computed(() => filteredItems.value.length);
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
    const paginatedItems = computed(() => {
        startItem.value = (currentPage.value - 1) * itemsPerPage.value;
        endItem.value = currentPage.value * itemsPerPage.value;
        return filteredItems.value.slice(startItem.value, endItem.value);
    });

    const paginationLinks = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const maxVisible = 7; // number of visible pages around the current page
        const visiblePages = [];
        if (total <= 10) {
            for (let i = 1; i <= total; i++) {
                visiblePages.push(i);
            }
        } else {
            if (current <= maxVisible - 2) {
                for (let i = 1; i <= maxVisible - 1; i++) {
                    visiblePages.push(i);
                }
                visiblePages.push('...');
                visiblePages.push(total);
            } else if (current >= total - (maxVisible - 2)) {
                visiblePages.push(1);
                visiblePages.push('...');
                for (let i = total - (maxVisible - 2); i <= total; i++) {
                    visiblePages.push(i);
                }
            } else {
                visiblePages.push(1);
                visiblePages.push('...');
                for (let i = current - 2; i <= current + 2; i++) {
                    visiblePages.push(i);
                }
                visiblePages.push('...');
                visiblePages.push(total);
            }
        }
        return visiblePages;
    });

    watch(items, () => {
        currentPage.value = 1;
    });

    return {
        itemsPerPage,
        itemsPerPageOptions,
        currentPage,
        startItem,
        endItem,
        search,
        filteredItems,
        totalItems,
        totalPages,
        paginatedItems,
        paginationLinks,
    };
}
