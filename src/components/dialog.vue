<template>
    <el-dialog :title="title" v-model="isVisible" :fullscreen="fullscreen" @close="handleClose">
        <slot></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>


<script lang="ts" setup>
import {defineComponent, onMounted, ref} from "vue";
import {ElDialog} from "element-plus";
import {useDialogStore} from "../store/dialog";

const props = defineProps(['title', 'fullscreen', 'route']);
const emit = defineEmits(['close']);
const isVisible = ref(true);
const dialogStore = useDialogStore();

const handleScroll = (event: MouseEvent) => {
    // @ts-ignore
    dialogStore.dialogScrollHeight = event.target.scrollTop;
}

onMounted(() => {
    // @ts-ignore
    document.querySelector('.el-overlay-dialog').addEventListener('scroll', handleScroll);
});

const handleClose = () => {
    dialogStore.hideDialog(props.route);
    emit('close');
};

</script>

<script lang="ts">

export default defineComponent({
    name: 'PMDialog',
});
</script>
