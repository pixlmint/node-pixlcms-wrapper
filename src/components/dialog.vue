<template>
    <el-dialog :title="title" v-model="isVisible" :fullscreen="fullscreen" @close="handleClose">
        <slot></slot>
    </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {ElDialog} from "element-plus";
import {useDialogStore} from "../../journal/app/src/store/dialog";

export default defineComponent({
    name: 'PMDialog',
    components: {
        ElDialog
    },
    props: ['title', 'fullscreen', 'route'],
    setup(props, {emit}) {
        const dialogStore = useDialogStore();
        const isVisible = ref(true);

        const handleClose = () => {
            dialogStore.hideDialog(props.route);
            emit('close');
        };

        return {isVisible, handleClose};
    }
});
</script>
