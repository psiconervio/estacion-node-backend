import React from "react";
import WeatherVideo from "./WeatherVideo";
import WeatherStats from "./WeatherStats";
import Uv from "../Uv/Uv";

const WeatherCard = ({ esp32Data = {}, weatherData = {}, uvData = {} }) => {
  // Desestructuramos los datos con valores predeterminados
  const {
    main = {},
    weather = [],
    wind = {},
    clouds = {},
    visibility = "No disponible",
  } = weatherData;

  // Control de datos faltantes
  const temperature = esp32Data.temperature || "No disponible";
  const humidity = esp32Data.humidity || "No disponible";
  const anemometro = esp32Data.anemometro || "No disponible";
  const veleta = esp32Data.veleta || "No disponible";
  const pluviometro = esp32Data.pluviometro || "No disponible";
  const uvValue = uvData?.result?.ozone || "No disponible";

  return (
    <div style={{ marginTop: "20px", border: "1px solid #eee", padding: "15px" }}>
      <h2>Clima Actual</h2>
      <WeatherVideo videoSrc="/videos/blue_sky.mp4" />

      <WeatherStats
        temperature={temperature}
        humidity={humidity}
        anemometro={anemometro}
        veleta={veleta}
        pluviometro={pluviometro}
        uvValue={uvValue}
        pressure={main.pressure || "No disponible"}
        clouds={clouds.all || "No disponible"}
        visibility={visibility}
      />

      <div style={{ marginTop: "10px" }}>
        <Uv />
      </div>
    </div>
  );
};

export default WeatherCard;
// // src/components/Weather/WeatherCard.jsx
// import React from "react";
// import WeatherVideo from "./WeatherVideo";
// import WeatherStats from "./WeatherStats";
// import Uv from "../Uv/Uv";

// const WeatherCard = ({ esp32Data, weatherData, uvData }) => {
//   // Controlamos si faltan datos
//   console.log("esp32Data:", esp32Data);
// console.log("weatherData:", weatherData);
// console.log("uvData:", uvData);
//   if (!esp32Data || !weatherData) {
//     return <div>Cargando clima...</div>;
//   }

//   // Ejemplo de uso de weatherData
//   const { main, weather, wind, clouds, visibility } = weatherData;

//   return (
//     <div style={{ marginTop: "20px", border: "1px solid #eee", padding: "15px" }}>
//       <h2>Clima Actual</h2>
//       <WeatherVideo videoSrc="/videos/blue_sky.mp4" />

//       <WeatherStats
//         temperature={esp32Data.temperature}
//         humidity={esp32Data.humidity}
//         anemometro={esp32Data.anemometro}
//         veleta={esp32Data.veleta}
//         pluviometro={esp32Data.pluviometro}
//         uvValue={uvData?.result?.ozone}
//         pressure={main?.pressure}
//         clouds={clouds?.all}
//         visibility={visibility}
//       />

//       <div style={{ marginTop: "10px" }}>
//         <Uv />
//       </div>
//     </div>
//   );
// };

// export default WeatherCard;

// // src/components/Weather/WeatherCard.jsx
// import React from 'react';
// import WeatherVideo from './WeatherVideo';
// import WeatherStats from './WeatherStats';
// // import Image from '../UI/Image'; // Puedes usar un componente de imagen o el tag <img>
// import Uv from '../UV/Uv';

// const WeatherCard = ({ esp32Data, weatherData, uvData }) => {
//   // Valores por defecto para evitar cambios de layout
//   if (!weatherData || !esp32Data.createdAt) {
//     return <div className="text-center">Cargando estación...</div>;
//   }

//   const {
//     main: { temp, feels_like, pressure },
//     weather,
//     wind: { speed, gust },
//     clouds: { all },
//     visibility,
//   } = weatherData;

//   const ozono = uvData?.result?.ozone;
//   const descripcionCielo = weather[0].description;
//   const sensacionTermica = feels_like - 273.15;
//   const visibilidadCalc = visibility / 1000;

//   const { videoSrc, descripcionTexto } = getVideoAndDescription(descripcionCielo);

//   return (
//     <div className="weather-card p-4 bg-gray-800 text-white rounded-lg">
//       <h2 className="text-2xl font-bold mb-2">Datos Meteorológicos</h2>
//       <WeatherVideo videoSrc={videoSrc} />
//       <div className="mt-4">
//         <p className="text-4xl font-bold">{esp32Data.temperature}°C</p>
//         <p>
//           {descripcionTexto} | Sensación Térmica {sensacionTermica.toFixed(1)}°C
//         </p>
//       </div>
//       <WeatherStats
//         visibilidad={visibilidadCalc}
//         pressure={pressure}
//         allClouds={all}
//         esp32Data={esp32Data}
//         ozono={ozono}
//       />
//       <div className="mt-4 flex justify-around items-center">
//         <img src="/images/muniwhite.png" width="130" height="130" alt="Muni" />
//         <div className="text-center text-xs">
//           Fecha Actualización: <br />
//           {esp32Data.createdAt} hs.
//         </div>
//         <img src="/images/whitenodo.png" width="130" height="130" alt="NODO" />
//       </div>
//     </div>
//   );
// };

// function getVideoAndDescription(descripcionCielo) {
//   const videoMap = {
//     'overcast clouds': { videoSrc: '/videos/nublado.mp4', descripcionTexto: 'Nubes superpuestas' },
//     'clear sky': { videoSrc: '/videos/blue_sky.mp4', descripcionTexto: 'Cielo Limpio' },
//     'broken clouds': { videoSrc: '/videos/pocasnubess.mp4', descripcionTexto: 'Nubes rotas' },
//     'thunderstorm with rain': { videoSrc: '/videos/storm.mp4', descripcionTexto: 'Tormenta con lluvia' },
//     'light rain': { videoSrc: '/videos/lluvialigera1.mp4', descripcionTexto: 'Lluvia ligera' },
//     'few clouds': { videoSrc: '/videos/pocasnubess.mp4', descripcionTexto: 'Pocas Nubes' },
//     'scattered clouds': { videoSrc: '/videos/nubesdispersas.mp4', descripcionTexto: 'Nubes Dispersas' },
//     'light intensity shower rain': { videoSrc: '/videos/rainn.mp4', descripcionTexto: 'Lluvia ligera' },
//   };
//   return videoMap[descripcionCielo] || { videoSrc: '', descripcionTexto: '' };
// }

// export default WeatherCard;
