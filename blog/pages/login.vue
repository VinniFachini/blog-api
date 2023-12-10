
<template>
    <div class="bg-slate-700 flex h-screen items-center flex-col justify-center w-screen">
        <Head>
            <Title>Login</Title>
        </Head>
        <form @submit.prevent="handleLogin(this.loginUsername, this.loginPassword)" method="POST" class="bg-slate-900 p-10 rounded-md">
            <h1 class="text-white text-2xl text-center w-full mb-5">Login</h1>
            <TextInput class="my-4" v-model="loginUsername" label="Username" type="text" placeholder="Your Username" :required="true" inputFull/>
            <TextInput class="my-4" v-model="loginPassword" label="Password" type="password" placeholder="Your Password" :required="true" inputFull/>
            <ButtonInput text="Login" type="submit" rounded class="mt-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200" buttonFull />
        </form>
    </div>
</template>

<script>
import { useAuth } from '~/composables/auth'
export default {
    setup() {
        const router = useRouter()
        const {loggedIn} = useAuth()
        if(loggedIn.value == true) {
            router.push('/admin')
        }
    },
    data() {
        return {
            loginUsername: "",
            loginPassword: "",
        }
    },
    methods: {
        async handleLogin(username, password) {
            const { loggedIn, user, login } = useAuth()
            const success = await login({username, password})
            if(success) {
                this.redirect()
            }
        },
        redirect() {
            const router = useRouter()
            router.push('/admin')
        }
    }
}
</script>