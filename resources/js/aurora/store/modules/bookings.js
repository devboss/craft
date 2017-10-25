import api from "../../api";

import noty from '../../noty';

const state = {
	bookings: [],
	booking: {
		id: 0,
		bookingReference: '',
		reservationId: '',
		bookingName: null,
        booker: {
		    id: 0
        },
		bookedDate: '',
		bookedTime: '',
		adultsTickets: 0,
		seniorsTickets: 0,
		childrenTickets: 0,
		infantsTickets: 0,
		carersTickets: 0,
		wheelchairsTickets: 0,
		adultAmount: [],
		seniorAmount: [],
		childAmount: [],
		infantAmount: [],
		carerAmount: [],
		wheelchairAmount: [],
		paidAmount: '0.00',
		stopSell: false,
        premiumSlot: false,
	},
	tickets: [],
	childAttendees: [],
	adultAttendees: [],
    carerAttendees: [],
    seniorAttendees: [],
	adultPrice: '0.00',
	seniorPrice: '0.00',
	childPrice: '0.00',
	additionalTickets: {
		adults: 0,
		seniors: 0,
		children: 0,
		infants: 0,
		carers: 0,
		wheelchairs: 0,
	},
	additionalExtras: []
};

const actions = {
	loadBookings({commit}) {
		return new Promise((resolve, reject) => {
			api.get('mmb/bookings')
				.then((response) => {
					let currencyProperties = [
						'adultAmount',
						'seniorAmount',
						'childAmount',
						'infantAmount',
						'carerAmount',
						'wheelchairAmount',
						'paidAmount',
					];

					let bookings = _.map(response.data, data => {
						let booking = data;

						currencyProperties.forEach(property => {
							if (booking[property] && booking[property].length > 1) {
								booking[property] = parseFloat(Math.round(booking[property][1] * 100) / 100).toFixed(2);
							}
						});

						return booking;
					});

					commit('setBookings', {bookings: _.orderBy(bookings, 'id', 'desc')});

					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSC');
					console.error(error);
					reject(error);
				});
		});
	},
	loadTickets({commit}, bookingId) {
		return new Promise((resolve, reject) => {
			api.get('mmb/bookings/' + bookingId + '/tickets')
				.then(response => {
					commit('setTickets', {tickets: response.data});

					let attendees = _.map(response.data, ticket => {
						ticket.attendee.ticketId = ticket.id;

						if (ticket.attendee.answers) {
							if (ticket.attendee.answers.yearsOfAttendance) {
								ticket.attendee.answers.yearsOfAttendance = ticket.attendee.answers.yearsOfAttendance.split(',');
							} else {
								ticket.attendee.answers.yearsOfAttendance = [];
							}
						}

						return ticket.attendee;
					});

					let childAttendees = _.filter(attendees, ticket => {
						return ticket.type === 'CHILD';
					});
					childAttendees.forEach(child => {
						if(child.dob !== null) {
							child.dob = moment(child.dob, 'DD/MM/YYYY').toDate();
						}
					});
					commit('setChildAttendees', {childAttendees: childAttendees});

					let adultAttendees = _.filter(attendees, ticket => {
						return ticket.type === 'ADULT';
					});

					commit('setAdultAttendees', {adultAttendees: adultAttendees});

					const seniorAttendees = _.filter(attendees, ticket => {
					    return ticket.type === 'SENIOR';
                    });

                    commit('setSeniorAttendees', {seniorAttendees: seniorAttendees});

                    const carerAttendees = _.filter(attendees, ticket => {
                        return ticket.type === 'CARER';
                    });

                    commit('setCarerAttendees', {carerAttendees: carerAttendees});

					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSB');
					console.error(error);
					reject(error);
				});
		});
	},
	loadTimeSlotPrices({commit}, {bookingId, location, season}) {
		return new Promise((resolve, reject) => {
			api.get('mmb/bookings/' + bookingId + '/price?location=' + location + '&season=' + season)
				.then(response => {
					let currencyProperties = [
						'adultPrice',
						'seniorPrice',
						'childPrice',
					];

					let timeSlot = response.data;

					currencyProperties.forEach(property => {
						if (timeSlot[property] && timeSlot[property].length > 1) {
							timeSlot[property] = parseFloat(Math.round(timeSlot[property][1] * 100) / 100).toFixed(2);
						}
					});

					commit('setTimeSlotPrices', timeSlot);
					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSN');
					console.error(error);
					reject(error);
				});
		});
	},
	reserveAdditionalTickets({commit}, {bookingId, adults, seniors, children, infants, carers, wheelchairs, extras}) {
        sessionStorage.setItem('mmb__reserveAdditionalTickets', JSON.stringify({bookingId, adults, seniors, children, infants, carers, wheelchairs, extras}));

		commit('setAdditionalTickets', {adults, seniors, children, infants, carers, wheelchairs});
		if(extras && extras.length > 0) {
		    extras.forEach(extra => {
                commit('setAdditionalExtras', extra);
            });

        }

		return new Promise((resolve, reject) => {
			let tickets = 'adults.' + adults + '-seniors.' + seniors + '-children.' + children + '-infants.' + infants
				+ '-carers.' + carers + '-wheelchairs.' + wheelchairs;

			api.get('mmb/checkout/' + bookingId + '/additionalTickets', {
				params: {
					tickets: tickets,
					extras: _.map(extras, extra => {
						return extra.qty + '.' + extra.id;
					}).join('-'),
				}
			})
				.then(response => {

				    if(response.data.message && response.data.message === 'Skipped payment and completed booking with 0 cost') {
                        return resolve('Skipped payment and completed booking with 0 cost');
                    }

					response.data.reservationView = response.data.reservation;

					commit('setCheckout', response.data);
					commit('setReservationId', response.data.reservationView.id);
					commit('setReservationExpiry', response.data.reservationView.validUntil);

					resolve();
				})
				.catch(error => {
					noty.displayNoty("Sorry, there are no tickets of this type available for this tour date.", false, false, 'alert', false);
					console.log(error);

					reject(error);
				});
		});
	},
    recoverAdditionalTickets({dispatch}) {
        let params = JSON.parse(sessionStorage.getItem('mmb__reserveAdditionalTickets'));
        sessionStorage.setItem('mmb__reserveAdditionalTickets', null);

        return dispatch('reserveAdditionalTickets', params);
    },
	orderAdditionalTickets({commit, getters}, {children, isTransfer = false}) {
		const checkout = getters.checkout;
		const customer = getters.getMyDetails;
		const extras = getters.getAdditionalExtras;

		children = _.map(children, child => {
			return child.name;
		});

		return new Promise((resolve, reject) => {
			api.post('mmb/orders', {
				reservationId: checkout.reservation.id,
				largeBooking: false,
				purchasedExtras: _.map(extras, extra => {
					return extra.qty + '.' + extra.id;
				}).join('-'),
				isAdditionalTicketCheckout: false,
				orderView: {
					paymentReference: checkout.paymentRequestParameters.transactionId,
					customerId: customer.id.toString(),
					firstName: customer.firstName,
					lastName: customer.lastName,
					emailAddress: customer.emailAddress,
					telephone: customer.telephone,
					childDetails: children.join(','),
					addressLine1: customer.address1,
					addressLine2: customer.address2,
					city: customer.city,
					postCode: customer.postCode,
					country: customer.country.countryCodeAlpha2,
					amountPaid: ['GBP', parseFloat(checkout.grandTotal)],
					originalAmountPaid: isTransfer ? null : parseFloat(checkout.grandTotal).toFixed(2),
					discountCode: '',
					referrerReasonId: 0
				}
			})
				.then(response => {
					commit('setOrder', response.data);
					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSM');
					console.error(error);
					reject(error);
				});
		});
	},
	confirmAdditionalTickets({commit, getters}, {transactionId, hash, bookingId}) {
		let booking = getters.getBooking;
		if(bookingId) {
			booking = {id: bookingId}
		}
		let reservationId = getters.getReservationId;

		return new Promise((resolve, reject) => {
			api.get('mmb/checkout/' + booking.id + '/additionalTickets/confirm/' + reservationId, {
				params: {
					transactionId: transactionId,
					responseCode: 'OK',
					hash: hash,
				}
			})
				.then(response => {
					commit('setReservationId', null);
					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSA');
					console.error(error);
					reject(error);
				});
		});
	},
    reserveAdditionalExtras({commit}, {bookingId, extras}) {
        sessionStorage.setItem('mmb__reserveAdditionalExtras', JSON.stringify({bookingId, extras}));

        return new Promise((resolve, reject) => {
            api.get('mmb/checkout/' + bookingId + '/additionalExtras', {
                params: {
                    extras: _.map(extras, extra => {
                        return extra.qty + '.' + extra.id;
                    }).join('-'),
                }
            })
                .then(response => {
                    commit('setCheckout', response.data);
                    commit('setReservationId', response.data.reserveReq);

                    resolve(response);
                })
                .catch(error => {
	                noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSS');
                    console.error(error);
                    reject(error);
                });
        });
    },
    recoverAdditionalExtras({dispatch, state}) {
        let params = JSON.parse(sessionStorage.getItem('mmb__reserveAdditionalExtras'));
        sessionStorage.setItem('mmb__reserveAdditionalExtras', null);

        state.additionalExtras = params.extras;

        return dispatch('reserveAdditionalExtras', params);
    },
	orderAdditionalExtras({commit, getters}) {
		const reservationId = getters.getReservationId;
		const checkout = getters.checkout;
		const children = _.map(getters.getChildAttendees, child => {
			return child.firstName;
		});
		const customer = getters.getMyDetails;
		const extras = getters.getAdditionalExtras;

		return new Promise((resolve, reject) => {
			api.post('mmb/orders', {
				reservationId: reservationId,
				largeBooking: false,
				purchasedExtras: _.map(extras, extra => {
					return extra.qty + '.' + extra.id;
				}).join('-'),
				isAdditionalTicketCheckout: false,
				orderView: {
					paymentReference: checkout.paymentRequestParameters.transactionId,
					customerId: customer.id.toString(),
					firstName: customer.firstName,
					lastName: customer.lastName,
					emailAddress: customer.emailAddress,
					telephone: customer.telephone,
					childDetails: children.join(','),
					addressLine1: customer.address1,
					addressLine2: customer.address2,
					city: customer.city,
					postCode: customer.postCode,
					country: customer.country.countryCodeAlpha2,
					amountPaid: ['GBP', parseFloat(checkout.grandTotal)],
					originalAmountPaid: parseFloat(checkout.grandTotal).toFixed(2),
					discountCode: '',
					referrerReasonId: 0
				}
			})
				.then(response => {
					commit('setOrder', response.data);
					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSD');
					console.error(error);
					reject(error);
				});
		});
	},
	confirmAdditionalExtras({commit, getters}, {transactionId, hash, bookingId}) {
		let booking = getters.getBooking;
		if(bookingId) {
			booking = {id: bookingId};
		}
		let reservationId = getters.getReservationId;

		return new Promise((resolve, reject) => {
			api.get('mmb/checkout/' + booking.id + '/additionalExtras/confirm/' + reservationId, {
				params: {
					transactionId: transactionId,
					responseCode: 'OK',
					hash: hash,
				}
			})
				.then(response => {
					commit('setReservationId', null);
					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSF');
					console.error(error);
					reject(error);
				});
		});
	},
	reserveTransfer({commit, dispatch, getters}) {
		let booking = getters.getBooking;
		let location = getters.location;
		let season = getters.season;
		let transferDate = moment(getters.day.date).format('YYYY-MM-DD');
		let transferTime = getters.slot.time;
		let reservationId = getters.slot.id;

		sessionStorage.setItem('mmb__reserveTransfer', JSON.stringify({
			booking,
			location,
			season,
			day: getters.day,
			slot: getters.slot
		}));

		return new Promise((resolve, reject) => {
			api.get('mmb/checkout/' + booking.id + '/transfer/' + location + '/' + season + '/' + transferDate + '/' + transferTime, {
				params: {
					reservationId: reservationId,
				}
			})
				.then(response => {
					let paymentRequired = _.has(response.data, 'paymentGatewayUrl');

					response.data.reservationView = response.data.reservation;

					if (paymentRequired) {

						commit('setCheckout', response.data);
						commit('setReservationId', response.data.reservationView.id);
						commit('setReservationExpiry', response.data.reservationView.validUntil);
					} else {
						booking.bookedDate = response.data.reservationView.date;
						booking.bookedTime = response.data.reservationView.time;
						commit('setBooking', {booking: booking});

						let bookings = getters.getBookings;
						_.remove(bookings, {id: booking.id});
						bookings.push(booking);
						commit('setBookings', {bookings: bookings});

						setTimeout(() => {
							dispatch('loadBookings');
						}, 300);
					}

					resolve(paymentRequired);
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSG');
					console.error(error);
					reject(error);
				});
		});
	},
    recoverTransfer({commit}) {
        let params = JSON.parse(sessionStorage.getItem('mmb__reserveTransfer'));
        sessionStorage.setItem('mmb__reserveTransfer', null);

        let booking = params.booking;
        let location = params.location;
        let season = params.season;
        let day = params.day;
        let slot = params.slot;
        let reservationId = slot.id;

        commit('setBooking', booking);
        commit('location', location);
        commit('season', season);
        commit('day', day);
        commit('slot', slot);

        return new Promise((resolve, reject) => {
            api.get('mmb/transfer/retry/' + reservationId)
                .then(response => {
                    response.data.reservationView = response.data.reservation;

                    commit('setCheckout', response.data);
                    commit('setReservationId', response.data.reservationView.id);
                    commit('setReservationExpiry', response.data.reservationView.validUntil);

                    resolve(response);
                })
                .catch(error => {
	                noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSH');
                    console.error(error);
                    reject(error);
                });
        });
    },
	confirmTransfer({commit, getters}, {transactionId, hash, bookingId}) {
		let booking = getters.getBooking;
		if(bookingId) {
			booking = {id: bookingId}
		}
		let reservationId = getters.getReservationId;

		return new Promise((resolve, reject) => {
			api.get('mmb/checkout/' + booking.id + '/transfer/confirm/' + reservationId, {
				params: {
					transactionId: transactionId,
					responseCode: 'OK',
					hash: hash,
				}
			})
				.then(response => {
					commit('setReservationId', null);
					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSJ');
					console.error(error);
					reject(error);
				});
		});
	},
	updateAttendee({dispatch}, {bookingId, attendee, booking}) {
		let ticketId = attendee.ticketId;

		attendee = _.omit(attendee, ['ticketId']);
        if (attendee.dob) {
            attendee.dob = moment(attendee.dob).format('DD/MM/Y');
        }
		if (attendee.answers) {
			attendee.answers.yearsOfAttendance = attendee.answers.yearsOfAttendance.join(',');
		}

		attendee.booking = booking;
		if(attendee.relationship && attendee.relationship.value) {
            attendee.relationship = attendee.relationship.value;
        }
		return new Promise((resolve, reject) => {
			api.post('mmb/bookings/' + bookingId + '/tickets/' + ticketId + '/attendee', attendee)
				.then(response => {
					dispatch('loadTickets', bookingId);
					resolve();
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSK');
					console.error(error);
					reject(error);
				});
		});
	},
    linkUnlinkPerson({dispatch}, {bookingId, ticketId, link}) {
		let endpoint = 'linkBookerDetails';
		if(link) {
			endpoint = 'unlinkBookerDetails';
		}
        return new Promise((resolve, reject) => {
            api.post(`mmb/bookings/${bookingId}/tickets/${ticketId}/${endpoint}`)
                .then(response => {
                    dispatch('loadTickets', bookingId);
                    resolve();
                })
                .catch(error => {
	                noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSL');
                    console.error(error);
                    reject(error);
                });
        });
    }
};

const mutations = {
	setBookings(state, {bookings}) {
		state.bookings = bookings;
	},
	setBooking(state, {booking}) {
		state.booking = booking;
		sessionStorage.setItem('mmb__bookingId', state.booking.id);
	},
	setTickets(state, {tickets}) {
		state.tickets = tickets;
	},
	setChildAttendees(state, {childAttendees}) {
		state.childAttendees = childAttendees;
	},
	setAdultAttendees(state, {adultAttendees}) {
		state.adultAttendees = adultAttendees;
	},
    setCarerAttendees(state, {carerAttendees}) {
        state.carerAttendees = carerAttendees;
    },
    setSeniorAttendees(state, {seniorAttendees}) {
        state.seniorAttendees = seniorAttendees;
    },
	setTimeSlotPrices(state, {adultPrice, seniorPrice, childPrice}) {
		state.adultPrice = adultPrice;
		state.seniorPrice = seniorPrice;
		state.childPrice = childPrice;
	},
	setAdditionalTickets(state, {adults, seniors, children, infants, carers, wheelchairs}) {
		state.additionalTickets = {adults, seniors, children, infants, carers, wheelchairs};
	},
	setAdditionalExtras(state, extra) {
        let currentExtra = _.find(state.additionalExtras, {id: extra.id});
        let workedOutPrice = ((extra.price/extra.multiple)*extra.selectedValue);

        if (currentExtra) {
            currentExtra.qty += extra.selectedValue;
            currentExtra.totalExtraPrice = parseFloat(parseFloat(currentExtra.totalExtraPrice) + workedOutPrice).toFixed(2);
        } else {
            const shallowExtra = _.cloneDeep(extra);
            shallowExtra.qty = extra.selectedValue;
            shallowExtra.totalExtraPrice = parseFloat(workedOutPrice).toFixed(2);
            state.additionalExtras.push(shallowExtra);
        }
	},
    removeAdditionalExtra(state, id) {
        state.additionalExtras = _.reject(state.additionalExtras, {id})
    },
	clearAdditionalTickets(state) {
		state.additionalTickets = [];
	},
	clearAdditionalExtras(state) {
		state.additionalExtras = [];
	},
	markAdultAsChanged(state, id) {
		let adult = _.find(state.adultAttendees, {id: id});
		if(adult) {
			adult.changed = true;
		}
	},
	resetAdultsAsChanged(state) {
		state.adultAttendees.forEach(adult => {
			adult.changed = false;
		});
	}
};

const getters = {
	getBookings(state) {
		return state.bookings;
	},
	getBooking(state) {
		if (state.booking.id === 0) {
			let bookingId = sessionStorage.getItem('mmb__bookingId');
			let booking = _.find(state.bookings, {id: parseInt(bookingId)});

			if (booking) {
                state.booking = booking;
			}
		}

		return state.booking;
	},
	getChildAttendees(state) {
		return state.childAttendees;
	},
	getAdultAttendees(state) {
		return state.adultAttendees;
	},
    getSeniorAttendees(state) {
        return state.seniorAttendees;
    },
    getCarerAttendees(state) {
        return state.carerAttendees;
    },
	getAdultPrice(state) {
		return state.adultPrice;
	},
	getSeniorPrice(state) {
		return state.seniorPrice;
	},
	getChildPrice(state) {
		return state.childPrice;
	},
	getAdditionalTickets(state) {
		return state.additionalTickets;
	},
	getAdditionalExtras(state) {
		return state.additionalExtras;
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
