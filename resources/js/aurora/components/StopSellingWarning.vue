<template>
    <div class="alert alert-danger" role="alert" v-if="mustStopSelling">
        <span class="icon icon--danger"></span> You can not modify your booking after {{ stopSellingDeadline }} the day before your tour.
    </div>
</template>

<script>
    import StopSelling from '../mixins/StopSelling';

    export default {
        mixins: [StopSelling]
    }
</script>
