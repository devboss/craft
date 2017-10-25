<template>
    <div class="nav-log" v-if="logs">
        <template v-if="isLoggedIn">
            <a class="nav-log__button--login" @click="logout"><span class="nav-log__button-text">Log-out</span></a>
            <a class="nav-log__button--login" href="/manage-my-booking/my-details"><span class="nav-log__button-text">My Details</span></a>
        </template>
        <template v-else>
            <a class="nav-log__button--login" href="/manage-my-booking"><span class="nav-log__button-text">Log-in</span></a>
        </template>
    </div>
    <ul v-else>
        <slot></slot>
        <template v-if="isLoggedIn">
            <li :class="itemClass"><a :class="linkClass" @click="logout">Log-out</a></li>
            <li :class="itemClass"><a :class="linkClass" href="/manage-my-booking/my-details">My Details</a></li>
        </template>
        <template v-else>
            <li :class="itemClass"><a :class="linkClass" href="/manage-my-booking">Log-in</a></li>
        </template>
        <slot name="after"></slot>
    </ul>
</template>

<script>
    export default {
        props: {
            logs: {
                type: Boolean,
                default: true
            },
            loggedIn: {
                type: Boolean,
                default: false
            },
            itemClass: {
                type: String,
                default: 'nav-scroll__menu-item'
            },
            linkClass: {
                type: String,
                default: 'nav-scroll__link'
            }
        },
        data() {
            return {
                cachedIsLoggedIn: null,
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isAuthenticated;
            },
        },
        methods: {
            logout() {
                this.$store.dispatch('logout').then(() => {
                    window.location = window.location.origin;
                });
            },
        },
    }
</script>
