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

<script lang="ts">
import {defineComponent, computed} from "vue";
import {useDialogStore} from "../store/dialog";
import {DialogComponent} from "../contracts/DialogComponent";

export default defineComponent({
    name: 'Modals',
    props: ['dialogComponents'],
    setup(props) {
        const dialogStore = useDialogStore();
        const showingDialogs = computed(() => dialogStore.getShowingDialogs.dialogs);

        const getComponent = (route: string) => {
            const mapping = props.dialogComponents.find((d: DialogComponent) => d.route === route);
            return mapping ? mapping.component : null;
        }

        return {
            showingDialogs,
            getComponent,
        };
    },
})
</script>