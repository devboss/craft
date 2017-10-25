<template>
    <div class="row">
        <div class="small-12 column text-center">
            <h2 class="heading-2--small-doves">Change Password</h2>
        </div>
        <div class="small-12 column child-form__form-wrapper">
            <div class="input-container margin-bottom-small">
                <label class="input-container__text text-right" for="currentPassword">Current password</label>
                <input type="password" class="form-control" id="currentPassword" v-model="currentPassword">
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': !hasValidPassword}]">
                <label class="input-container__text text-right" for="newPassword">New password</label>
                <input type="password" class="form-control" id="newPassword" @change="validatePassword"
                       v-model="newPassword">
                <span class="input-container__error" v-if="!hasValidPassword">Minimum 6 characters</span>
            </div>
            <div :class="['input-container margin-bottom-small', {'input-container--danger': !hasValidConfirmedPassword}]">
                <label class="input-container__text text-right" for="confirmPassword">Confirm new password</label>
                <input type="password" class="form-control" id="confirmPassword" @change="validateConfirmedPassword"
                       v-model="confirmPassword">
                <span class="input-container__error"
                      v-if="!hasValidConfirmedPassword">The confirmation password doesn't match</span>
            </div>
            <div class="input-container">
                <label>&nbsp;</label>
                <span class="input-container__help-text -no-italic">
                <a :class="['button margin-bottom-medium rotate-ccw-small', {'booking-summary__continue--disabled': !canChangePassword}]" style="width:100%;" @click="change">
                    <span class="button__inner">
                        <span class="button__text">Change password</span>
                        <svg class="button__arrow">
                            <use xlink:href="/images/svg/sprite.svg#button-arrow"
                                 xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                        </svg>
                    </span>
                </a>
            </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                hasValidPassword: true,
                hasValidConfirmedPassword: true,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        },
        computed: {
            canChangePassword() {
                return ((this.newPassword.length > 0) && this.hasValidPassword && this.hasValidConfirmedPassword)
            }
        },
        methods: {
            validatePassword() {
                this.hasValidPassword = (this.newPassword.length >= 6)
            },
            validateConfirmedPassword() {
                this.hasValidConfirmedPassword = (this.newPassword === this.confirmPassword);
            },
            change() {
                this.$store.dispatch('changePassword', {
                    currentPassword: this.currentPassword,
                    newPassword: this.newPassword,
                    confirmPassword: this.confirmPassword,
                });
            }
        }
    }
</script>