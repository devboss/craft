<template>
    <div class="row"><div class="small-12 column">
        <h1 class="image-title small-bottom-margin">
            <span class="image-title__image--my-account inline-block text-center">
                My Account
            </span>
        </h1>
        </div>
        <manage-details :my-details="myDetails"></manage-details>
        <manage-password></manage-password>
    </div>
</template>

<script>
    import ManageDetails from '../ManageDetails.vue';
    import ManagePassword from '../ManagePassword.vue';
    import MyDetails from '../../mixins/MyDetails';

    export default {
        components: {
            ManageDetails,
            ManagePassword,
        },
        mixins: [MyDetails],
    }
</script>