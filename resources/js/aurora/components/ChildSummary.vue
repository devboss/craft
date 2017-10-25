<template>
    <div>
        <div>
            <h2 class="heading-2__child-name">{{ child.firstName }}</h2>
        </div>
        <div class="child-summary__edit-details">
            <a class="" :class="['button margin-bottom-medium rotate-ccw-small']" @click="edit">
                <span class="button__inner">
                    <span class="button__text">Edit Details</span>
                    <svg class="button__arrow">
                        <use xlink:href="/images/svg/sprite.svg#button-arrow"
                             xmlns:xlink="http://www.w3.org/1999/xlink"></use>
                    </svg>
                </span>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'child-summary',
        props: {
            src: Object
        },
        data() {
            return {
                child: {
                    id: null,
                    first_name: '',
                    first_name_confirm: '',
                    last_name: '',
                    name_pronunciation: '',
                    gender: '',
                    relationship: 'Not Specified',
                    dob: null,
                    favourite_thing: '',
                    favourite_thing_relationship: '',
                    favourite_acivity: '',
                    memorable_event: '',
                    attended_before: false,
                    last_attended: []
                }
            }
        },
        mounted() {
            this.child = this.src;
        },
        methods: {
            edit() {
            	if(this.child.id === null) {
		            this.$router.push({name: 'new.child.edit', params: {ticketId: this.child.ticketId}});
		            return;
                }
                if (this.child.type === 'ADULT') {
                    this.$router.push({name: 'guest.edit', params: {id: this.child.id, adultsOnly: true}})
                } else {
                    this.$router.push({name: 'child.edit', params: {childId: this.child.id}})
                }
            }
        }
    }
</script>
