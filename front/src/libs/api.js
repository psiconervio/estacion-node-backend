// ...existing code...
url = 'http://localhost:3000/api/stations/';
options = "GET";
async function fetchFromApi(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
}

// ...existing code...
