<template>
    <FontAwesomeIcon :icon="`fa-${package} fa-${icon}`"/>
</template>

<script lang="ts">
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {defineComponent} from "vue";

export default defineComponent({
    name: 'PMIcon',
    props: {
        icon: {
            required: true,
            type: String,
        },
        package: {
            required: false,
            default: 'solid',
            type: String,
        },
    },
    components: {
        FontAwesomeIcon,
    }
})
</script>
