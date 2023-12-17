export const validateToken = async () => {
  const router = useRouter()
  const { session, update, reset } = await useSession()
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

export async function useFetch(baseurl, endpoint, method, body) {

  const { session, refresh, update, reset } = await useSession()

  const token = session.value.token && validateToken()

  if (token) {
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${session.value.token}`
      },
      body: JSON.stringify(body)
    }

    try {
      const response = await fetch(`${baseurl}/${endpoint}`, config);

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
