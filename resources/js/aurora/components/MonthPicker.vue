<script>
    import Datepicker from 'vuejs-datepicker';

    export default {
        extends: Datepicker,
        created() {
            this.$on('opened', () => {
                this.showMonthCalendar();
            });
            this.$on('changedMonth', month => {
                this.setDate(month.timestamp);
                this.close();
            });
        }
    }
</script>