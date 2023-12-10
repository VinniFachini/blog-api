export async function useFetch(baseurl, endpoint, method) {

    const token = sessionStorage.getItem('authToken')

    if(token) {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
      
        const options = {
          method: method,
          headers: headers,
        };
      
        try {
          const response = await fetch(`${baseurl}/${endpoint}`, options);
      
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
        console.error('User not authenticated')
    }
  }
  