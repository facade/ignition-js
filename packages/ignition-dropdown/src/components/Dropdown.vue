<template>
    <ul style="margin: 0; list-style-type: none; padding: 0;">
        <li
            v-for="error in errors"
            :key="error.hash"
            style="height: 50px; cursor: pointer;"
            @click="handleSelectError(error)"
        >
            {{ error.error.message }} ({{ error.occurrences }} occurrences)
        </li>
    </ul>
</template>

<script>
export default {
    created() {
        window.bridge.addEventListener('errors-updated', (errors) => {
            this.errors = errors;
        });
    },

    data: () => ({
        errors: [],
    }),

    methods: {
        handleSelectError(error) {
            window.bridge.showError(error.error);
        },
    },
};
</script>
