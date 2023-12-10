import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
    const loggedIn = ref(false)
    const user = ref(null)
    const router = useRouter()

    try {
        const storedToken = sessionStorage.getItem('authToken')
        if (storedToken) {
            loggedIn.value = true
        } else {
            router.push('/login')
        }
    } catch(err) {
        console.error(err)
    }


    async function login(userData) {
        let success = null;
        try {
            await fetch('http://localhost:3001/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then(r => r.json())
                .then(r => {
                    if (r.token) {
                        loggedIn.value = true
                        user.value = userData.username
                        sessionStorage.setItem('authToken', r.token)
                        success = true;
                    } else {
                        success = false
                    }
                })
        } catch (error) {
            console.log(error)
            
        }
        return success
    }

    function logout() {
        loggedIn.value = false
        user.value = null
        sessionStorage.removeItem('authToken')
        return true
    }

    return { loggedIn, user, login, logout }
}
