<template>
    <div class="column">

        <div :class="['image-misc__image--mobile-mmb-banner mmb-nav__mobile-menu hide-for-large', {'-mobile-menu': showMobileMenu}]" @click="toggleMobileMenu">
            <div>
                {{getRouteName($route.name)}}
            </div>
            <span class="image-misc__image--arrowdown"></span>
        </div>
        <ul :class="['mobile-mmb-nav__container hide-for-large mmb-nav__mobile-menu text-center', {'-mobile-menu': showMobileMenu}]" v-if="showMobileMenu">
            <li @click="toggleMobileMenu">
                <router-link :to="{ name: 'my-experience' }">My Visit</router-link>
            </li>
            <li @click="toggleMobileMenu">
                <router-link :to="{ name: 'my-party' }">Personalise</router-link>
            </li>
            <li @click="toggleMobileMenu">
                <router-link :to="{ name: 'magical-extras' }">Magical Extras</router-link>
            </li>
            <li>
                <label @click="showBookingsDropDown">
                    <a>
                        Booking: {{bookedDate}}
                    </a>
                </label>
            </li>
            <li v-if="hasBookings && bookingsDropdown" v-for="booking in bookings" class="mmb-nav__change-booking">
                <div class="my-experience__booking-dropdown--booking text-center"  @click="selectBooking(booking, true)">
                    {{booking.bookingReference}}
                </div>
            </li>
        </ul>


        <div class="image-misc__image--mmb-banner show-for-large">
            <ul class="mmb-nav__container">
                <li>
                    <router-link :to="{ name: 'my-experience' }">My Visit</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'my-party' }">Personalise</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'magical-extras' }">Magical Extras</router-link>
                </li>
                <li>
                    <label @click="showBookingsDropDown">
                        <a>
                            Booking: {{bookedDate}}
                            <span class="image-misc__image--down-arrow">

                            </span>
                        </a>
                    </label>
                </li>
            </ul>

            <div class="my-experience__booking-dropdown" v-if="hasBookings && bookingsDropdown">
                <div class="my-experience__booking-dropdown--booking text-center" v-for="booking in bookings" @click="selectBooking(booking)">
                    {{booking.bookingReference}}
                </div>
            </div>

        </div>
    </div>
</template>
<script>


    export default {
    	data() {
    		return {
			    bookingsDropdown: false,
			    showMobileMenu: false
            }
        },
    	computed: {
    		hasBookings() {
    			return this.$store.getters.getBookings && this.$store.getters.getBookings.length > 0;
            },
            bookings() {
    			return this.$store.getters.getBookings;
            },
            bookedDate() {
                return moment(this.$store.getters.getBooking.bookedDate).format('Do MMM');
            }
        },
        methods: {
        	logout() {
		        this.$store.dispatch('logout').then(() => {
			        this.$router.replace('/');
		        });
            },
            showBookingsDropDown() {
                this.bookingsDropdown = !this.bookingsDropdown;
            },
	        selectBooking(booking, mobileMenu = false) {
		        this.$store.commit('setBooking', {booking: booking});
		        this.$router.push({name: 'my-experience'});
		        this.showBookingsDropDown();
		        if(this.showMobileMenu) {
			        this.showMobileMenu = !this.showMobileMenu;
                }
	        },
	        getRouteName(name) {
        		let routeName = '';
        		if(name && (name === 'my-experience' || name === 'my-party.create' || name === 'availability.day' || name === 'availability.slot')) {
			        routeName = 'My Visit';
                }
		        if(name && (name === 'my-party' || name === 'child.edit')) {
			        routeName = 'Personalise';
		        }
		        if(name && name === 'magical-extras') {
			        routeName = 'Magical Extras';
		        }

		        if(routeName === '') {
			        routeName = 'My Visit';
                }

		        return routeName;
            },
	        toggleMobileMenu() {
                this.showMobileMenu = !this.showMobileMenu;
                if(this.bookingsDropdown) {
	                this.bookingsDropdown = !this.bookingsDropdown;
                }
            }
        }
    }
</script>