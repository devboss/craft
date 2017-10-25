<template>
    <div class="row">
        <div class="column">
            <header-bears></header-bears>
            <div class="row">
                <div class="small-12 column text-center">
                    <h1 class="image-title image-title--party-selector">
                    <span class="image-title__image--booktickets">
                        Book Tickets
                    </span>
                    </h1>
                </div>
            </div>

            <div class="row hide-for-small-only hide-for-medium-only">
                <div class="small-12 column text-center">
                    <h1 class="image-title image-title--party-selector">
                    <span class="image-misc__image--steps4">

                    </span>
                    </h1>
                </div>
            </div>

            <div class="row booking-complete__wrapper">
                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2>
                        Congratulations
                    </h2>
                </div>
                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2 class="heading-2--thankyou">
                        Thank you!
                    </h2>
                </div>
                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2 class="heading-2--booking-complete-message">
                        Your payment card has been successfully charged and your booking reference number is <strong>{{bookingReference}}</strong>.
                    </h2>
                </div>
                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2 class="heading-2--booking-complete-message">
                        We have emailed your confirmation to you, including a link to your unique Personalise My Visit page.
                    </h2>
                </div>
                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2 class="heading-2--booking-complete-message">
                        On the Personalise My Visit page you can tailor your experience, update your booking details, or add magical extras ahead of your visit.
                    </h2>
                </div>
                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2 class="heading-2--booking-complete-message">
                        We look forward to seeing you.
                    </h2>
                </div>

                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2 class="heading-2--booking-complete-message">
                        <strong>
                            The UK’s Best Family Day Out
                        </strong>
                    </h2>
                </div>

                <div class="small-12 medium-8 medium-offset-8 column">
                    <h2 class="heading-2--booking-complete-message">
                        <strong>
                            Little London Awards 2015 & 2016
                        </strong>
                    </h2>
                </div>


                <div class="small-12 medium-8 medium-offset-8 column">
                    <div class="image-misc__image--completecircle">
                        <div>
                            <h2 class="heading-2--share-the-magic">
                                Share the magic...
                            </h2>
                            <div class="booking-complete__share-the-magic-wrapper rotate-cw-five">
                                <a href="https://www.facebook.com/sharer/sharer.php?u=http%3A//www.laplanduk.co.uk/" target="_blank">
                                    <svg class="fit">
                                        <use xlink:href="/images/svg/sprite.svg#social-facebook"
                                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                    </svg>
                                </a>
                            </div>
                            <div class="booking-complete__share-the-magic-wrapper rotate-ccw-five">
                                <a href="https://www.instagram.com/laplanduk" target="_blank">
                                    <svg class="fit">
                                        <use xlink:href="/images/svg/sprite.svg#social-instagram"
                                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                    </svg>
                                </a>
                            </div>

                            <div class="booking-complete__share-the-magic-wrapper rotate-cw-five">
                                <a href="https://twitter.com/home?status=LaplandUK" target="_blank">
                                    <svg class="fit">
                                        <use xlink:href="/images/svg/sprite.svg#social-twitter"
                                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                    </svg>
                                </a>
                            </div>
                            <div class="booking-complete__share-the-magic-wrapper rotate-ccw-five">
                                <a href="https://www.youtube.com/channel/UC-ozYp1nCqVmxDpvW4vt5sQ" target="_blank">
                                    <svg class="fit">
                                        <use xlink:href="/images/svg/sprite.svg#social-youtube"
                                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="small-12 medium-8 medium-offset-8 column">
                    <div class="image-misc__image--eekofull hide-for-large">
                    </div>
                </div>


            </div>

        </div>
        <div class="image-misc__image--mobile-explore hide-for-large">
        </div>
        <div class="image-misc__image--eeko show-for-large">
        </div>
        <div class="image-misc__image--explore show-for-large">
        </div>

    </div>
</template>

<script>
	import HeaderBears from './HeaderBears';
	export default {
		components: {
			'header-bears': HeaderBears
		},
		computed: {
			bookingReference() {
				return this.$route.params.reference;
			}
		}
	}
</script>