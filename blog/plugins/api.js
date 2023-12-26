import { defineNuxtPlugin } from '#app';

export const validateToken = async () => {
    const { session, refresh, update, reset } = await useSession();
    const dateString = session.value.createdAt
    let dateObject = new Date(dateString)
    dateObject.setHours(dateObject.getHours() + session.value.expiresIn / 3600)
    const dateNow = new Date()
    const isTokenValid = !dateObject > dateNow
    if (isTokenValid) {
        router.push('/login')
        reset()
        return false
    } else {
        update(isTokenValid)
        return true
    }
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const { session, refresh, update, reset } = await useSession();
    const router = useRouter()
    return {
        provide: {
            validateToken: async () => {
                const dateString = session.value.createdAt
                let dateObject = new Date(dateString)
                dateObject.setHours(dateObject.getHours() + session.value.expiresIn / 3600)
                const dateNow = new Date()
                const isTokenValid = !dateObject > dateNow
                if (isTokenValid) {
                    router.push('/login')
                    reset()
                    return false
                } else {
                    update(isTokenValid)
                    return true
                }
            },
            useFetch: async (endpoint, method = 'get', reqBody) => {
                const token = session.value.token && validateToken()
                if (token) {
                    const config = {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${session.value.token}`
                        },
                        body: reqBody ? JSON.stringify(reqBody) : null
                    }
                    try {
                        const response = await fetch(`http://localhost:3001/${endpoint}`, config);

                        if (response.ok) {
                            const jsonData = await response.json();
                            return jsonData;
                        } else {
                            throw new Error(`Request failed with status: ${response.status} - ${response.statusText}`);
                        }
                    } catch (error) {
                        console.error('Fetch error:', error.message);
                        throw error;
                    }
                } else {
                    const router = useRouter()
                    router.push('/login')
                }
            }
        }
    }
})