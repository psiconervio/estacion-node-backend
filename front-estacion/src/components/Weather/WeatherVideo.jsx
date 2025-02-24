// src/components/Weather/WeatherVideo.jsx
import React from "react";

const WeatherVideo = ({ videoSrc }) => {
  if (!videoSrc) return null;

  return (
    <video
      src={videoSrc}
      autoPlay
      loop
      muted
      style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
    />
  );
};

export default WeatherVideo;

// // src/components/Weather/WeatherVideo.jsx
// import React from 'react';

// const WeatherVideo = ({ videoSrc }) => {
//   if (!videoSrc) return null;

//   return (
//     <video
//       src={videoSrc}
//       autoPlay
//       loop
//       muted
//       className="w-full h-48 object-cover rounded-lg"
//       style={{ aspectRatio: '300/200', objectFit: 'cover' }}
//     />
//   );
// };

// export default WeatherVideo;
