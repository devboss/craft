<template>
    <div>
        <template v-if="isExtras">
            <div class="extra-selector__extra-timer-bg">
                <div class="row nopadding">
                    <div class="small-12 medium-12 large-12 column nopadding">
                        <h1 class="heading-1-justlovely-48">
                            The perfect extras for the perfect Lapland<sup>UK</sup> experience!
                        </h1>
                    </div>
                    <div class="small-12 medium-12 large-12 column nopadding">
                        <div class="extra-timer__main-body-text">
                            Make your Lapland<sup>UK</sup> experience even more memorable by getting to know our characters before your visit, spending elf money on your day trip, or your child finding the very toy they made with the elves in their stocking on Christmas morning. Order these Magical Extras now then sit back and wait for your family’s Christmas adventure to begin.
                        </div>
                    </div>
                    <div class="small-3 column nopadding extra-timer__hourglass-wrapper hide-for-medium">
                        <div class="image-misc__image--largehourglass">

                        </div>
                    </div>
                    <div class="small-1 column nopadding extra-timer__hourglass-wrapper hide-for-small-only">
                        <div class="image-misc__image--largehourglass">

                        </div>
                    </div>
                    <div class="small-10 column extra-selector__small-time-text nopadding extra-timer__hourglass-wrapper hide-for-small-only">
                        <div class="extra-timer__timer-copy">
                            <strong>
                                We will reserve your place at Lapland<sup>UK</sup> for {{defaultTimeLeft}} minutes while you complete your order
                            </strong>
                        </div>
                        <div class="extra-timer__timer-copy--time">
                            <strong>
                                <p v-if="hasTimeRemaining" class="extra-selector__time">
                                    {{ timeUntilReservationExpires }}
                                </p>
                                <template v-else>
                                    Your session has expired! You now need to search for a tour again.
                                </template>
                            </strong>
                        </div>
                    </div>
                    <div class="small-9 column extra-selector__small-time-text nopadding extra-timer__hourglass-wrapper hide-for-medium">
                        <div class="extra-timer__timer-copy">
                            <strong>
                                We will reserve your place at Lapland<sup>UK</sup> for {{defaultTimeLeft}} minutes while you complete your order
                            </strong>
                        </div>
                        <div class="extra-timer__timer-copy--time">
                            <strong>
                                <p v-if="hasTimeRemaining" class="extra-selector__time">
                                    {{ timeUntilReservationExpires }}
                                </p>
                                <template v-else>
                                    Your session has expired! You now need to search for a tour again.
                                </template>
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="image-misc__image--timerbox hide-for-small-only">
                <div class="row">
                    <div class="small-2 column">
                        <div class="image-misc__image--largehourglass">

                        </div>
                    </div>
                    <div class="small-10 column extra-selector__large-time-text">
                        We will reserve your place at Lapland<sup>UK</sup> for {{defaultTimeLeft}} minutes while you complete your order
                        <p v-if="hasTimeRemaining" class="extra-selector__time">
                            {{ timeUntilReservationExpires }}
                        </p>
                        <template v-else>
                            Your session has expired! You now need to search for a tour again.
                        </template>
                    </div>
                </div>
            </div>
            <div class="image-misc__image--mobiletimerbox">
                <div class="row">
                    <div class="small-2 column">
                        <div class="image-misc__image--mobilehourglass">

                        </div>
                        <p v-if="hasTimeRemaining" class="extra-selector__time-small">
                            {{ timeUntilReservationExpires }}
                        </p>
                        <template v-else>
                            Your session has expired! You now need to search for a tour again.
                        </template>
                    </div>
                    <div class="small-10 column extra-selector__small-time-text">
                        We will reserve your place at Lapland<sup>UK</sup> for {{defaultTimeLeft}} minutes while you complete your order
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
	export default {
		props: {
			duration: {
				type: Number,
				default: 300,
			},
			isExtras: {
				type: Boolean,
				default: false
			},
            defaultTimeLeft: {
				type: String,
                default: "20"
            }
		},
		data() {
			return {
				hasTimeRemaining: true,
				reservationTimer: {
					minutes: 0,
					seconds: 0,
				},
			}
		},
		mounted() {
			this.startTimer();
		},
		computed: {
			alertTypeClass() {
				return this.hasTimeRemaining ? 'alert-warning' : 'alert-danger';
			},
			timeUntilReservationExpires() {
				let minutes = this.reservationTimer.minutes < 10 ? "0" + this.reservationTimer.minutes : this.reservationTimer.minutes;
				let seconds = this.reservationTimer.seconds < 10 ? "0" + this.reservationTimer.seconds : this.reservationTimer.seconds;

				return minutes + ':' + seconds;
			},
		},
		methods: {
			startTimer() {
				let timer = moment(this.$store.getters.reservationExpiry).clone().diff(moment(), 's');
				this.hasTimeRemaining = true;
				this.reservationTimer.minutes = parseInt(timer / 60, 10);
				this.reservationTimer.seconds = parseInt(timer % 60, 10);

				let interval = setInterval(() => {
					if (--timer <= 0) {
						clearInterval(interval);
						this.hasTimeRemaining = false;
						this.$emit('expired');
					}

					this.reservationTimer.minutes = parseInt(timer / 60, 10);
					this.reservationTimer.seconds = parseInt(timer % 60, 10);
				}, 1000);
			}
		}
	}
</script>