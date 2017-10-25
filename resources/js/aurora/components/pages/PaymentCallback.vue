<template>
    <div class="error-page error-page--conker">
        <h1 class="image-title image-title--oops">
            <span class="image-title__image--oops">Oops!</span>
        </h1>
        <div class="error-page__summary">
            <p>{{ errorMessage }}</p>
        </div>
        <div class="error-page__suggestion">
            <p>Please try again, if the problem persists contact <a href="mailto:enquiries@laplanduk.co.uk">enquiries@laplanduk.co.uk</a>.</p>
        </div>
    </div>
</template>

<script>
    import store from '../../store';

    const config = {
        tickets: {
            successAction: 'confirmAdditionalTickets',
            success: {name: 'transfer.complete'},
            recoverAction: 'recoverAdditionalTickets',
            failure: {name: 'payment'}
        },
        extras: {
            successAction: 'confirmAdditionalExtras',
            success: {name: 'transfer.complete'},
            recoverAction: 'recoverAdditionalExtras',
            failure: {name: 'extras.payment'}
        },
        transfer: {
            successAction: 'confirmTransfer',
            success: {name: 'transfer.complete'},
            recoverAction: 'recoverTransfer',
            failure: {name: 'transfer.payment'}
        },
    };

    export default {
        beforeRouteEnter (to, from, next) {
            let options = _.get(config, to.params.type);

            if (to.query.success === 'false') {
                store.commit('setPaymentErrors', {
                    errorCode: to.query.errorCode,
                    errorMessage: to.query.errorMessage,
                    errors: to.query.validationErrors,
                });

                store.dispatch(options.recoverAction)
                    .then(response => {
                        next(options.failure);
                    })
                    .catch(error => {
                        next();
                    });
                return;
            }

            store.dispatch(options.successAction, {
                transactionId: to.query.transactionId,
                hash: to.query.hash,
                bookingId: to.query.bookingId
            }).then(() => {
                store.dispatch('loadBookings').then(() => {
                    next(options.success);
                });
            });
        },
        computed: {
            errorCode() {
                return this.$route.query.errorCode;
            },
            errorMessage() {
                return this.$route.query.errorMessage;
            },
            validationErrors() {
                return this.$route.query.validationErrors;
            }
        }
    }
</script>