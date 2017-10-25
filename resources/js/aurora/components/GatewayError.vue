<template>
    <div class="alert alert-danger" role="alert" v-if="error.exists()">
        <strong>{{ error.errorCode }}</strong> {{ error.errorMessage }} <br> {{ error.validationErrors }}
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        computed: mapGetters({
            error: 'getError',
        }),
    }
</script>