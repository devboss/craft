<template>
    <div class="row nopadding">
        <div class="small-12 children__boxes-wrapper">
            <div class="children__box" v-for="child in children">
                <div class="image-misc__image--child-details-box text-left">
                    <child-summary :src="child" @edit="edit(child)"></child-summary>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import ChildSummary from './ChildSummary.vue'

    export default {
        components: {
            'child-summary': ChildSummary
        },
        props: {
            children: Array
        },
        data() {
            return {
                currentChildId: null
            }
        },
        computed: {
            currentChild() {
                return _.find(this.children, {id: this.currentChildId})
            }
        },
        methods: {
            edit(child) {
                this.currentChildId = child.id;
            },
            update() {
                this.currentChildId = null;
            }
        }
    }
</script>