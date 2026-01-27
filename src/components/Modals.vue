<template>
    <div class="modals">
        <component
            v-for="dialog in showingDialogs"
            :key="dialog.route"
            :is="getComponent(dialog.route)"
            :data="dialog.data"
        ></component>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useDialogStore } from "../store/dialog";
import { DialogComponent } from "../contracts/DialogComponent";

const dialogStore = useDialogStore();

const props = defineProps<{ dialogComponents: DialogComponent[] }>();
const showingDialogs = computed(() => dialogStore.showingDialogs.dialogs);

const getComponent = function(route: string) {
    const mapping = props.dialogComponents.find((d: DialogComponent) => d.route === route);
    console.log(mapping);
    return mapping ? mapping.component : null;
}
</script>
