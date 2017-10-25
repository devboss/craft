<template>
	<div class="row nopadding">
		<div class="small-12 column nopadding">
			<h2 class="heading-2--cancel-protection">Cancellation Protection</h2>
		</div>
		<div class="small-12 column cancel-protection__copy nopadding">
			<p>
				Due to the temporary nature of Lapland<sup>UK</sup>, all tickets are non refundable. However, we understand
				that sometimes your plans need to change so are happy to transfer your booking to a new date up
				to 7 days before your visit, subject to availability.
			</p>
			<p>
				TicketPlan cancellation protection is also available for your booking. We strongly recommend
				that you include this option. Your tickets are non-refundable and this will protect you against
				cancellation resulting from accidents and unexpected illnesses. Full details are included in the
				<a :href="termsUrl" target="_blank">
					TicketPlan terms and conditions
				</a>,
				which we advise you to read and retain. Please note restrictions apply in relation to
				pre-existing medical conditions.
			</p>
			<p>
				By purchasing cancellation protection, your tickets are fully refundable subject to the terms and
				conditions of TicketPlan.
			</p>
			<p>Ticket Cancellation Protection price for your booking:</p>
			<div class="cancel-protection__price">
				£{{ ticketPlanPrice }}
			</div>
			<div class="cancel-protection__choice">
				<label @click="update('addProtection', true)">
                    <div class="cancel-protection__radio-outer" >
                        <div class="cancel-protection__radio-inner" v-if="choice === true">

                        </div>
                    </div>
					<input name="insurance" type="radio" data-type="Cancellation Protection">

						Yes, please protect my purchase (total additional cost <span>£{{ ticketPlanPrice }}</span>)
						I confirm that I have read, understood and saved the
						<a :href="termsUrl" target="_blank" class="cancel-protection__termsandconds">terms and conditions</a>
						of the TicketPlan Cancellation Protection.

				</label>
			</div>
			<div class="cancel-protection__choice">
				<label @click="update('removeProtection', false)">
                    <div class="cancel-protection__radio-outer">
                        <div class="cancel-protection__radio-inner" style="" v-if="choice === false">

                        </div>
                    </div>
					<input name="insurance" type="radio" data-type="Cancellation Protection">
						I do not wish to purchase cancellation protection and accept my tickets are non-refundable.
				</label>
			</div>
		</div>
	</div>

</template>

<script>

	export default {
		props: {
			termsUrl: {
				type: String,
				default: '//www.ticketplangroup.com/uploads/assets/SUMMARY-TPOSALXCATLIN210815.pdf'
			},
			ticketPlanPrice: String,
			insuranceSelected: Object
		},
        data() {
			return {
				choice: null
            };

        },
		methods: {
			update(value, choice = null) {
				this.choice = choice;
				this.$emit(value);
			}
		}
	}
</script>