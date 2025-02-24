// utils/fetchData.js
export async function fetchAllData() {
    try {
      const [esp32Response, weatherResponse, uvResponse] = await Promise.all([
        fetch("/api/frontend/lastrecord", {
          cache: "no-store",
          method: "POST",
        }),
        fetch("/api/frontend/weather", {
          cache: "no-store",
          method: "POST",
        }),
        fetch("/api/frontend/apiuv", {
          cache: "no-store",
          method: "POST",
        }),
      ]);
  
      const esp32Data = await esp32Response.json();
      const weatherData = await weatherResponse.json();
      const uvData = await uvResponse.json();
  
      return { esp32Data, weatherData, uvData };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error al llamar a las APIs" };
    }
  }
  