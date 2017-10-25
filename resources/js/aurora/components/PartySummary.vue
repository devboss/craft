<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h2 class="panel-title">Your Party</h2>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Adults</th>
                    <th>Seniors</th>
                    <th>Children</th>
                    <th>Babies</th>
                    <th>Carers</th>
                    <th>Wheelchairs</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ adults }}</td>
                    <td>{{ seniors }}</td>
                    <td>{{ children }}</td>
                    <td>{{ babies }}</td>
                    <td>{{ carers }}</td>
                    <td>{{ wheelchairs }}</td>
                    <td>£{{ total }}</td>
                </tr>
            </tbody>
        </table>
        <div class="panel-footer text-center">
            <router-link class="btn btn-default" :to="{name:'my-party.create'}">Add people to your party</router-link>
            <router-link class="btn btn-default" :to="{name:'availability.day'}">Change the date of visit</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            adults: {
                type: Number,
                default: 0
            },
            seniors: {
                type: Number,
                default: 0
            },
            children: {
                type: Number,
                default: 0
            },
            babies: {
                type: Number,
                default: 0
            },
            carers: {
                type: Number,
                default: 0
            },
            wheelchairs: {
                type: Number,
                default: 0
            },
            total: {
                type: String,
                default: '257.00'
            },
        }
    }
</script>