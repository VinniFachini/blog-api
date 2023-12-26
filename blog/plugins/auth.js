export default defineNuxtPlugin(async (nuxtApp) => {
    const { session, refresh, update, reset } = await useSession();
    return {
        provide: {
            loginUser: async (userData) => {
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                }
                let response = await fetch('http://localhost:3001/auth/login', config)
                response = await response.json()
                if (response.token) {
                    update(response)
                    console.log(session)
                }
            }
        }
    }
});