<template>
    <div>
        <h2>Congratulations!</h2>

        <p>You have successfully added to your Visit.</p>

        <p>You will receive an email with your updated booking confirmation and top tips on how to have the most magical day at Lapland<sup>UK</sup>.</p>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.$store.commit('party', {
                adults: 0,
                seniors: 0,
                children: 0,
                babies: 0,
                carers: 0,
                wheelchairs: 0
            });
        }
    }
</script>