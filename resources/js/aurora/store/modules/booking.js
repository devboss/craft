import api from '../../api';

import noty from '../../noty';

const state = {
    locations: {},
    promptForLocation: true,
    promptForSeason: true,
    availability: [],
    slotAvailability: [],
    availableExtras: [],
    availableInsurance: [],
    location: '',
    season: '',
    adults: 0,
    seniors: 0,
    children: 0,
    babies: 0,
    carers: 0,
    wheelchairs: 0,
	adultsOnly: false,
    day: null,
    slot: null,
    extras: [],
    transactionId: null,
    reservationId: null,
    reservationExpiry: null,
    order: null,
    checkout: null,
    paymentErrors: null,
	hash: null,
    referrers: [],
    referrer: null,
	premiumSearchEnabled: (window.bookingPortalPremiumTickets ? window.bookingPortalPremiumTickets : false),
	premiumSearch: false
};

const actions = {
    loadReferrers({commit}) {
        api.get('portal/referrers')
        .then((response) => {
            commit('setReferrers', response.data);
        })
        .catch((error) => {
	        noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWS1');
            console.error(error)
        });
    },
	loadLocations({commit}) {
		api.get('portal/locationSeasons')
		.then((response) => {
			commit('locations', response.data.content)

			if (response.data.onlyOneLocationOption) {
				commit('promptForLocation', false)
				commit('location', response.data.defaultLocation)
			}

			if (response.data.onlyOneLocationSeasonOption) {
				commit('promptForSeason', false)
				commit('season', response.data.defaultSeason)
			}
		})
		.catch((error) => {
			noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWS2');
			console.error(error)
		})
	},
	reserveSlot({commit, state}) {
		return api.post('availabilities/reserve',
			{
				adults: state.adults,
				carers: state.carers,
				children: state.children,
				infants: state.babies,
				seniors: state.seniors,
				wheelchairs: state.wheelchairs,
				date: moment(state.day.date).format('YYYY-MM-DD'),
				time: state.slot.time,
				location: state.location,
				season: state.season,
				reservationId: state.slot.id
			}
		)
	},
	startCountdown({commit}) {
		commit('resetReservationExpiry')
		commit('setReservationExpiry', moment().add(5, 'm'))
	},
	checkAvailability({commit, state}) {
		api.get('availabilities/locations/' + state.location + '/seasons/' + state.season, {
			params: {
				ad: state.adults,
				se: state.seniors,
				ch: state.children,
				ca: state.carers,
				wh: state.wheelchairs,
                in: state.babies,
                inf: state.premiumSearch ? "PREMIUM+" : ""
			}
		})
		.then((response) => {
			let availability = _.map(response.data.summaryView.availability, day => {
			    let info = [];
			    if(day.informationTags) {
                    info = day.informationTags;
                } else if(day.information) {
                    info = day.information;

                    if(info !== '') {
                        info = _.map(_.filter(info.split(","), (i, k) => {return (k === 0 || k === 1);}), (item, i) => {
                            return item;
                        });
                    }
                }


				return {
					date: moment(day.date),
					availableSlots: day.availableSlots,
					nicePrice: day.formattedLowestPrice,
					information: info,
					totalSlots: day.totalSlots,
					isActive: (day.availableSlots > 0),
					isSelected: false,
					lowestPrice: day.lowestPrice[1]
				}
			});

			commit('availability', availability)
		})
		.catch((error) => {
			noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWS3');
			console.error(error)
		})
	},
	loadSlotAvailability({commit, state}) {
		api.get(`availabilities/locations/${state.location}/seasons/${state.season}/dates/${state.day.date.format('YYYY-MM-DD')}`, {
			params: {
				ad: state.adults,
				se: state.seniors,
				ch: state.children,
				ca: state.carers,
				wh: state.wheelchairs,
                in: state.babies,
                inf: state.premiumSearch ? "PREMIUM+" : ""
			}
		})
		.then(response => {
			let slots = _.map(response.data.dateAvailabilityView.availability, slot => {
				let info = slot.information;

				if(info !== '') {
					info = _.map(_.filter(info.split(", "), (i, k) => {return (k === 0 || k === 1);}), (item, i) => {
						return item;
					});
				}

				return {
					activeReservations: slot.activeReservations,
					allAdultSlotsAvailable: slot.allAdultSlotsAvailable,
					childrenSlotsAvailable: slot.childrenSlotsAvailable,
					groupsAvailable: slot.groupsAvailable,
					information: info,
					adultPrice: slot.prettyAdultPrice,
					childPrice: slot.prettyChildPrice,
					seniorPrice: slot.prettySeniorPrice,
					totalPrice: slot.prettyTotalPrice,
					time: slot.time,
					id: (slot.id === '--unavailable--') ? false : slot.id
				}
			});

			commit('slotAvailability', slots)
		})
		.catch((error) => {
			noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWS4');
			console.error(error)
		})
	},
    loadAvailableExtras({commit}) {
        return new Promise((resolve, reject) => {
            api.get('availabilities/extras')
                .then(response => {
                    const data = _.filter(response.data, extra => {
                        return (extra.type !== 'INSURANCE');
                    });
                    const insurance = _.filter(response.data, extra => {
                        return (extra.type === 'INSURANCE');
                    });

                    let extras = _.map(data, extra => {
                        let steps = _.range(11);
                        if (extra.multiple > 1) {
                            steps = _.range(25, 205, extra.multiple);
                            steps.splice(0, 0, 0);
                        }
                        return {
                            id: extra.id,
                            shortDescription: extra.shortDescription,
                            description: extra.description,
                            multiple: extra.multiple,
                            name: extra.name,
                            price: parseFloat(extra.prettyPrice).toFixed(2),
                            type: extra.type,
                            steps: steps,
							image: '//lluk-aurora.s3.amazonaws.com/images/extras/' + extra.type + '.png',
                            images: extra.images,
                            selectedValue: 0
                        };
                    });

                    let insuranceExtras = _.map(insurance, extra => {

                        return {
                            id: extra.id,
                            description: extra.description,
                            multiple: extra.multiple,
                            name: extra.name,
                            price: parseFloat(extra.prettyPrice).toFixed(2),
                            type: extra.type,
                            selectedValue: 0
                        };
                    });

                    commit('availableExtras', extras);
                    commit('availableInsurance', insuranceExtras);

                    resolve();
                })
                .catch((error) => {
	                noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSQ');
                    console.error(error);
                    reject(error);
                });
        });
    },
    createCheckout({commit, state}) {
        const magicExtras = _.map(state.extras, extra => {
            return `${extra.selectedValue}.${extra.id}`
        });

        return new Promise((resolve, reject) => {
            api.get(`portal/checkout/${state.slot.id}`, {
                params: {
                    reservationId: state.slot.id,
                    transactionId: state.transactionId,
                    extras: magicExtras.join('-'),
                }
			})
				.then(response => {
                    let slot = _.cloneDeep(state.slot);
                    slot.id = response.data.reservationView.id;

                    commit('slot', slot);
                    commit('setReservationId', slot.id);
                    commit('setCheckout', response.data);
                    commit('setHash', response.data.paymentRequestParameters.hash);
                    commit('setTransactionId', response.data.paymentRequestParameters.transactionId);
                    if(response.data.validUntil) {
                        //response.data.validUntil
                        commit('setReservationExpiry', moment().add(response.data.validUntil, 's'));
                    }

                    resolve(response);
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSW');
				    console.error(error);
					reject();
				});
        });
    },
    applyPromoCode({commit, state}, params) {
        const magicExtras = _.map(state.extras, extra => {
            return `${extra.selectedValue}.${extra.id}`
        });

        return new Promise((resolve, reject) => {
            api.get('portal/promoCodes/' + params.promoCode + '/apply', {
                params: {
                    reservationId: state.slot.id,
                    transactionId: state.transactionId,
					extras: magicExtras.join('-'),
                }
            })
                .then(response => {
                    let slot = _.cloneDeep(state.slot);
                    let extras = _.cloneDeep(state.extras);
                    let promoCodeRules = response.data.promoCodeDto;

                    // Total discount

                    // TODO: Implement money off total
                    if (slot.totalPrice > 0) {
                        slot.totalPrice = parseFloat(slot.totalPrice) - (parseFloat(slot.totalPrice) * promoCodeRules.percentOffTotal);
                    }

                    _.forEach(extras, extra => {
                        if (extra.totalExtraPrice > 0) {
                            extra.totalExtraPrice = parseFloat(extra.totalExtraPrice) - (parseFloat(extra.totalExtraPrice) * promoCodeRules.percentOffTotal);
                        }
                    });

                    // Ticket discount

                    if (slot.totalPrice > 0) {
                        slot.totalPrice = parseFloat(slot.totalPrice) - promoCodeRules.moneyOffTicket[1];
                    }

                    if (slot.totalPrice > 0) {
                        slot.totalPrice = parseFloat(slot.totalPrice) - (parseFloat(slot.totalPrice) * promoCodeRules.percentOffTicket);
                    }

                    // Extras discount

                    // TODO: Implement money off extras
                    _.forEach(extras, extra => {
                    	if (extra.totalExtraPrice > 0) {
                            extra.totalExtraPrice = parseFloat(extra.totalExtraPrice) - (parseFloat(extra.totalExtraPrice) * promoCodeRules.percentOffExtras);
						}
					});

                    if(slot.totalPrice > 0 && promoCodeRules.moneyOffTotal && promoCodeRules.moneyOffTotal[1] > 0) {
	                    slot.totalPrice = parseFloat(slot.totalPrice) - promoCodeRules.moneyOffTotal[1];
                    }

                    commit('slot', slot);
                    commit('setExtras', extras);
                    commit('setReservationId', slot.id);
                    commit('setHash', response.data.paymentRequestParameters.hash);

                    let checkout = _.cloneDeep(state.checkout);
                    checkout.grandTotal = response.data.prettyGrandTotal;
                    checkout.paymentRequestParameters = response.data.paymentRequestParameters;

                    commit('setCheckout', checkout);

                    resolve(response);
                })
                .catch(error => {
	                //noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSE');
                    console.error(error);
                    reject(error);
                });
        });
    },
	createOrder({commit, state}, params) {
		const magicExtras = _.map(state.extras, extra => {
			return `${extra.selectedValue}.${extra.id}`
		});
		const children = _.map(params.children, child => {
			return child.name;
		});
		const totalExtras = _.reduce(state.extras, (sum, extra) => {
			return sum + parseFloat(extra.totalExtraPrice);
		}, 0.00);
		let body = {
			customerRef: '',
			largeBooking: false,
			magicExtras: magicExtras.join('-'),
			orderView: {
				addressLine1: params.billing.address1,
				addressLine2: params.billing.address2,
				amountPaid: ['GBP',parseFloat(parseFloat(state.slot.totalPrice)+parseFloat(totalExtras))],
				childDetails: children.join(','),
				adultDetails: '',
				seniorDetails: '',
				carerDetails: '',
				city: params.billing.city,
				country: params.billing.country.code,
				customerId: '',
				discountCode: params.code,
				emailAddress: params.customer.emailAddress,
				firstName: params.customer.firstName,
				lastName:  params.customer.lastName,
				originalAmountPaid: parseFloat(parseFloat(state.slot.totalPrice)+parseFloat(totalExtras)).toFixed(2),
				paymentReference: state.checkout.paymentRequestParameters.transactionId,
				postCode:  params.billing.postcode,
				referrerReasonId: params.referrer && params.referrer.id ? params.referrer.id : 0,
				telephone:  params.customer.telephone
			},
			persisted: false
		};

		if (state.adultsOnly) {
			body.orderView.adultDetails = children.join(',');
			body = _.omit(body, 'orderView.childDetails');
		}

        return new Promise((resolve, reject) => {
            api.post(`portal/orders/${state.slot.id}`, body)
				.then(response => {
                    commit('setOrder', response.data);
					resolve(response);
				})
				.catch(error => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSR');
					console.error(error);
					reject(error);
				});
        });
	},
	finaliseOrder({state}, params) {
		return api.get(`portal/checkout/confirm/${params.id}`,
			{
				params: {
					transactionId: params.transactionId,
					responseCode: params.responseCode,
					hash: params.hash,
				}
			}
		);
	},
	orderFailed({commit, getters}, params) {
        const magicExtras = _.map(getters.extras, extra => {
            return `${extra.selectedValue}.${extra.id}`
        });

        return new Promise((resolve, reject) => {
                api.get(`portal/checkout/${params.id}`, {
                    params: {
                        reservationId: params.id,
                        transactionId: params.transactionId,
                        extras: magicExtras.join('-'),
                    }
                })
					.then(response => {
						commit('setCheckout', response.data);
						commit('setHash', response.data.paymentRequestParameters.hash);
						commit('setTransactionId', response.data.paymentRequestParameters.transactionId);
						if(response.data.validUntil) {
							//response.data.validUntil
							commit('setReservationExpiry', moment().add(response.data.validUntil, 's'));
						}
						resolve(response);
					})
					.catch(error => {
						noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWST');
                        console.error(error);
						reject(error);
					});
        });
	},
	recoverFromFailedPayment({commit, state}, params) {
		return new Promise((resolve, reject) => {

			api.get(`availabilities/locations/${state.location}/seasons/${state.season}`, {
				params: {
					ad: state.adults,
					se: state.seniors,
					ch: state.children,
					ca: state.carers,
					wh: state.wheelchairs,
                    in: state.babies,
                    inf: state.premiumSearch ? "PREMIUM+" : ""
				}
			})
			.then((response) => {
				let availability = _.map(response.data.summaryView.availability, day => {
					if(moment(params.date).isSame(moment(day.date))) {
						commit('day', {
							date: moment(day.date),
							availableSlots: day.availableSlots,
							nicePrice: day.formattedLowestPrice,
							information: day.information,
							totalSlots: day.totalSlots,
							isActive: (day.availableSlots > 0),
							isSelected: false
						});
					}
					return {
						date: moment(day.date),
						availableSlots: day.availableSlots,
						nicePrice: day.formattedLowestPrice,
						information: day.information,
						totalSlots: day.totalSlots,
						isActive: (day.availableSlots > 0),
						isSelected: false
					}
				});
				commit('availability', availability);


				//load the slot
				api.get(`availabilities/locations/${state.location}/seasons/${state.season}/dates/${state.day.date.format('YYYY-MM-DD')}`, {
					params: {
						ad: state.adults,
						se: state.seniors,
						ch: state.children,
						ca: state.carers,
						wh: state.wheelchairs,
                        in: state.babies,
                        inf: state.premiumSearch ? "PREMIUM+" : ""
					}
				})
				.then(response => {
					let slots = _.map(response.data.dateAvailabilityView.availability, slot => {
						if(slot.time === params.time) {
							commit('slot',
								{
									activeReservations: slot.activeReservations,
									allAdultSlotsAvailable: slot.allAdultSlotsAvailable,
									childrenSlotsAvailable: slot.childrenSlotsAvailable,
									groupsAvailable: slot.groupsAvailable,
									information: slot.information,
									adultPrice: slot.prettyAdultPrice,
									childPrice: slot.prettyChildPrice,
									seniorPrice: slot.prettySeniorPrice,
									totalPrice: slot.prettyTotalPrice,
									time: slot.time,
									id: params.id
								}
							);
						}
						return {
							activeReservations: slot.activeReservations,
							allAdultSlotsAvailable: slot.allAdultSlotsAvailable,
							childrenSlotsAvailable: slot.childrenSlotsAvailable,
							groupsAvailable: slot.groupsAvailable,
							information: slot.information,
							adultPrice: slot.prettyAdultPrice,
							childPrice: slot.prettyChildPrice,
							seniorPrice: slot.prettySeniorPrice,
							totalPrice: slot.prettyTotalPrice,
							time: slot.time,
							id: (slot.id === '--unavailable--') ? false : slot.id
						}
					})
					commit('slotAvailability', slots);


					//load the extras and map them
					api.get(`availabilities/extras`)
					.then(response => {
						const data = _.filter(response.data, extra => {
							return (extra.type !== 'INSURANCE');
						});
						const insurance = _.filter(response.data, extra => {
							return (extra.type === 'INSURANCE');
						});

						let extras = _.map(data, extra => {
							let steps = _.range(11);
							if (extra.multiple > 1) {
								steps = _.range(25, 205, extra.multiple);
								steps.splice(0, 0, 0);
							}

							if(params.extras) {
								const foundExtra = _.find(params.extras, {id: extra.id});
								if(foundExtra) {
									const extraToAdd = {
										id: extra.id,
										description: extra.description,
										multiple: extra.multiple,
										name: extra.name,
										price: parseFloat(parseFloat(extra.prettyPrice).toFixed(2)*1).toFixed(2),
										type: extra.type,
										steps: steps,
										selectedValue: foundExtra.quantity
									};
									commit('addExtra', extraToAdd);
								}
							}

							return {
								id: extra.id,
								description: extra.description,
								multiple: extra.multiple,
								name: extra.name,
								price: parseFloat(parseFloat(extra.prettyPrice).toFixed(2)*1).toFixed(2),
								type: extra.type,
								steps: steps,
                                images: extra.images,
                                selectedValue: 0
							};
						});

						let insuranceExtras = _.map(insurance, extra => {

							if(params.extras) {
								const foundExtra = _.find(params.extras, {id: extra.id});
								if(foundExtra) {
									const extraToAdd = {
										id: extra.id,
										description: extra.description,
										multiple: extra.multiple,
										name: extra.name,
										price: parseFloat(parseFloat(extra.prettyPrice).toFixed(2)*1).toFixed(2),
										type: extra.type,
										selectedValue: foundExtra.quantity
									};
									commit('addExtra', extraToAdd);
								}
							}


							return {
								id: extra.id,
								description: extra.description,
								multiple: extra.multiple,
								name: extra.name,
								price: parseFloat(parseFloat(extra.prettyPrice).toFixed(2)*1).toFixed(2),
								type: extra.type,
                                selectedValue: 0
							};
						});

						commit('availableExtras', extras);
						commit('availableInsurance', insuranceExtras);

						resolve();
					})
					.catch((error) => {
						noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWSY');
						console.error(error);
						reject();
					})
				})
				.catch((error) => {
					noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWS5');
					console.error(error)
					reject()
				})

			})
			.catch((error) => {
				noty.displayNoty(error.message ? error.message : '', error.stack, 'QAZWS6');
				console.error(error)
				reject();
			})

		});
	}
};

const mutations = {
    setAdultsOnly(state, payload) {
        state.adultsOnly = payload.adultsOnly;
    },
    setReferrers(state, referrers) {
        state.referrers = referrers;
    },
    setReferrer(state, referrer) {
        state.referrer = referrer;
    },
	locations(state, locations) {
		state.locations = locations
	},
	promptForLocation(state, promptForLocation) {
		state.promptForLocation = promptForLocation
	},
	promptForSeason(state, promptForSeason) {
		state.promptForSeason = promptForSeason
	},
	availability(state, availability) {
		state.availability = availability
	},
	resetAvailability(state) {
		state.availability = []
	},
	slotAvailability(state, slotAvailability) {
		state.slotAvailability = slotAvailability
	},
	resetSlotAvailability(state) {
		state.slotAvailability = []
	},
	availableExtras(state, availableExtras) {
		state.availableExtras = availableExtras
	},
	availableInsurance(state, insurance) {
		state.availableInsurance = insurance
	},
	locations(state, locations) {
		state.locations = locations
	},
	location(state, location) {
		state.location = location
	},
	season(state, season) {
		state.season = season
	},
	party(state, party) {
		state.adults = _.get(party, 'adults', 0);
		state.seniors = _.get(party, 'seniors', 0);
		state.children = _.get(party, 'children', 0);
		state.babies = _.get(party, 'babies', 0);
		state.carers = _.get(party, 'carers', 0);
		state.wheelchairs = _.get(party, 'wheelchairs', 0);
	},
	day(state, day) {
		state.day = day
	},
    slot(state, slot) {
        state.slot = slot
    },
    setExtras(state, extras) {
        state.extras = extras;

        if (extras === null) {
            window.Vue.localStorage.storage.removeItem('bp__extras');
        } else {
	        const saveExtras = _.map(state.extras, extra => {
		        return {
			        selectedValue: extra.selectedValue,
			        id: extra.id
		        };
	        });
	        window.Vue.localStorage.storage.setItem('bp__extras', JSON.stringify(saveExtras));
        }
    },
	addExtra(state, extra) {
		let currentExtra = _.find(state.extras, {id: extra.id});
		let workedOutPrice = ((extra.price/extra.multiple)*extra.selectedValue);

		if (currentExtra) {
			currentExtra.qty += extra.selectedValue;
			currentExtra.totalExtraPrice = parseFloat(parseFloat(currentExtra.totalExtraPrice) + workedOutPrice).toFixed(2);
		} else {
			const shallowExtra = _.cloneDeep(extra);
			shallowExtra.qty = extra.selectedValue;
			shallowExtra.totalExtraPrice = parseFloat(workedOutPrice).toFixed(2);
			state.extras.push(shallowExtra);
		}
		const saveExtras = _.map(state.extras, extra => {
			return {
				selectedValue: extra.selectedValue,
				id: extra.id
			};
		});
		window.Vue.localStorage.storage.setItem('bp__extras', JSON.stringify(saveExtras));
	},
	removeExtra(state, id) {
		state.extras = _.reject(state.extras, {id})
	},
	removeInsuranceExtra(state) {
		state.extras = _.reject(state.extras, {type: 'INSURANCE'})
	},
	resetExtras(state) {
		state.extras = []
	},
	resetReservationExpiry(state) {
		state.reservationExpiry = null
	},
    setReservationExpiry(state, time) {
        state.reservationExpiry = time
    },
    setTransactionId(state, id) {
        state.transactionId = id;
    },
    setReservationId(state, id) {
        state.reservationId = id;

        if (id === null) {
	        window.Vue.localStorage.storage.removeItem('mmb__reservationId');
        } else {
	        window.Vue.localStorage.storage.setItem('mmb__reservationId', id);
        }
    },
	resetOrder(state) {
		state.order = null;
	},
	resetCheckout(state) {
		state.checkout = null;
	},
	setOrder(state, order) {
		state.order = order;
	},
	setCheckout(state, checkout) {
		state.checkout = checkout;
	},
	setFinalisedOrder(state, order) {
		state.confirmedOrder = order;
	},
	resetPaymentErrors(state) {
		state.paymentErrors = null;
	},
    setPaymentErrors(state, errors) {
        state.paymentErrors = errors;
    },
    setHash(state, hash) {
        state.hash = hash;
    },
    clearDayAndSlot(state) {
        state.day = null;
        state.slot = null;
	},
	setPremiumSearch(state, search) {
    	state.premiumSearch = search;
	}
};

const getters = {
    getAdultsOnly(state) {
        return state.adultsOnly;
    },
    referrers: (state) => {
        return state.referrers;
    },
    referrer: (state) => {
        return state.referrer;
    },
	locations: (state) => {
		return state.locations
	},
	promptForLocation: (state) => {
		return state.promptForLocation
	},
	promptForSeason: (state) => {
		return state.promptForSeason
	},
	availability: (state) => {
		return state.availability
	},
	slotAvailability: (state) => {
		return state.slotAvailability
	},
	availableExtras: (state) => {
		return state.availableExtras
	},
	availableInsurance: (state) => {
		return state.availableInsurance
	},
	party: (state) => {
		return {
			adults: state.adults,
			seniors: state.seniors,
			children: state.children,
			babies: state.babies,
			carers: state.carers,
			wheelchairs: state.wheelchairs,
		}
	},
	day: (state) => {
		return state.day
	},
	slot: (state) => {
		return state.slot
	},
	extras: (state) => {
        if (state.extras !== null) {
            return state.extras;
        }

        return JSON.parse(window.Vue.localStorage.storage.getItem('bp__extras'));
	},
	location: (state) => {
		return state.location
	},
	season: (state) => {
		return state.season
	},
    reservationExpiry: (state) => {
        return state.reservationExpiry
    },
    getTransactionId: (state) => {
		return state.transactionId;
    },
    getReservationId: (state) => {
        if (state.reservationId !== null) {
            return state.reservationId;
        }

        return window.Vue.localStorage.storage.getItem('mmb__reservationId');
    },
	checkout: (state) => {
		return state.checkout;
	},
	order: (state) => {
		return state.order;
	},
    paymentErrors: (state) => {
        return state.paymentErrors;
    },
    getHash: (state) => {
        return state.hash;
    },
	premiumSearchEnabled: (state) => {
    	return state.premiumSearchEnabled;
	},
	premiumSearch: (state) => {
    	return state.premiumSearch;
	}
};

export default {
	state,
	getters,
	actions,
	mutations,
}
