<template>
	<form id="paymentGatewayForm" method="POST" :action="gatewayUrl">
		<input type="hidden" name="reserveReq" :value="reserveReq" />
		<input type="hidden" name="grandTotal" :value="grandTotal" />
		<input type="hidden" name="hash" :value="hash" />
		<input type="hidden" name="transactionId" :value="transactionId" />
		<input type="hidden" name="successRedirectionUrl" :value="successRedirectionUrl" />
		<input type="hidden" name="failureRedirectionUrl" :value="failureRedirectionUrl" />
		<input type="hidden" name="paymentAmount.currency" :value="paymentAmountCurrency" />
		<input type="hidden" name="paymentAmount.amount" :value="paymentAmountAmount" />
		<input type="hidden" name="customer.customerId" :value="customerId" />
		<input type="hidden" name="firstName" :value="firstName" />
		<input type="hidden" name="lastName" :value="lastName" />
		<input type="hidden" name="telephone" :value="telephone" />
		<input type="hidden" name="email" :value="email" />
		<input type="hidden" name="confirmEmail" :value="confirmEmail" />
		<template v-if="adultsOnly">
			<input type="hidden" name="adultFirstName" :value="guestFirstName" v-if="guestFirstName" />
		</template>
		<template v-else>
			<input type="hidden" name="childFirstName" :value="guestFirstName" v-if="guestFirstName" />
		</template>
		<input type="hidden" name="creditCard.cardholderName" :value="cardCardholderName" />
		<input type="hidden" name="creditCard.type" :value="cardType" />
		<input type="hidden" name="creditCard.cardNumber" :value="cardNumber" />
		<input type="hidden" name="creditCard.expiryDate" :value="expiryDate" />
		<input type="hidden" name="creditCard.cvn" :value="cvn" />
		<input type="hidden" name="creditCard.issueNo" :value="issueNo" />
		<input type="hidden" name="billingAddress.addressLine1" :value="addressLine1" />
		<input type="hidden" name="billingAddress.addressLine2" :value="addressLine2" />
		<input type="hidden" name="billingAddress.city" :value="city" />
		<input type="hidden" name="billingAddress.postCode" :value="postCode" />
		<input type="hidden" name="billingAddress.country" :value="country" />
		<input type="hidden" name="referrerReasonId" :value="referrerReasonId" />
	</form>
</template>

<script>
	export default {
		props: {
			gatewayUrl: String,
			reserveReq: String,
			grandTotal: String,
			hash: String,
			transactionId: String,
			successRedirectionUrl: String,
			failureRedirectionUrl: String,
			paymentAmountCurrency: String,
			paymentAmountAmount: String,
			customerId: String,
			firstName: String,
			lastName: String,
			telephone: String,
			email: String,
			confirmEmail: String,
			adultsOnly: Boolean,
            guestFirstName: String,
			cardCardholderName: String,
			cardType: String,
			cardNumber: String,
			expiryDate: String,
			cvn: String,
			issueNo: String,
			addressLine1: String,
			addressLine2: String,
			city: String,
			postCode: String,
			country: String,
			referrerReasonId: Number
		}
	}
</script>
