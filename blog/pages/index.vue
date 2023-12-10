<template>
    <h1 class="text-3xl font-bold underline">
        Hello world! {{ loggedIn }}
    </h1>
</template>
<script>

import {useAuth} from '~/composables/auth'
export default {
    setup() {
            const {loggedIn} = useAuth()
    
            return {loggedIn}
        }
}


</script>