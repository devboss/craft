<template>
    <div class="row">
        <div class="column">
            <payment-errors :message="this.paymentErrors.errorMessage" :validation-errors="validationErrors"></payment-errors>
        </div>
    </div>
</template>


<script>
	import PaymentErrorsMixin from '../../mixins/PaymentErrors';
	import PaymentError from '../PaymentErrors.vue';
	export default {
		components: {
			'payment-errors': PaymentError
		},
		mixins: [PaymentErrorsMixin],
        computed: {
            validationErrors() {
                let validationErrors = _.trim(this.paymentErrors.errors, '[]');

                if (validationErrors.length === 0) {
                    return [];
                }

                return [validationErrors];
            }
        }
	}
</script>