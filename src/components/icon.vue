<template>
    <FontAwesomeIcon :icon="`fa-solid fa-${icon}`"/>
</template>

<script lang="ts">
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {defineComponent} from "vue";

export default defineComponent({
    name: 'PMIcon',
    props: ['icon'],
    components: {
        FontAwesomeIcon,
    }
})
</script>
