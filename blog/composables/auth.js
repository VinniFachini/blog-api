import { ref } from 'vue'
import { useFetch } from './api'

export async function useAuth() {
    const {session, refresh, update, reset} = await useSession()
    const router = useRouter()

    const login = async (userData) => {
        const config = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        }
        let response = await fetch('http://localhost:3001/auth/login', config)
        response = await response.json()
        if(response.token) {
            update(response)
        }
    }

    function logout() {
        reset()
    }

    return { login, logout }
}
