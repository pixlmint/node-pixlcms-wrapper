<template>
    <el-button @click="clicked">
        <template v-if="icon !== undefined">
            <pj-icon :icon="icon"></pj-icon>
        </template>
        <template v-if="content !== undefined">
            {{ content }}
        </template>
    </el-button>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'PMButtonLink',
    props: ['href', 'action', 'content', 'icon'],
    data() {
        return {
        }
    },
    methods: {
        clicked() {
            if (this.href) {
            } else if (this.action) {
                this.action();
            }
        },
    },
})
</script>
