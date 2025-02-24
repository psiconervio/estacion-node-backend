import mongoose from "mongoose";

const WeatherDataSchema = new mongoose.Schema({
  station: { type: mongoose.Schema.Types.ObjectId, ref: "Station" }, // Relación con estación
  temperature: Number,
  humidity: Number,
  windSpeed: Number,
  recordedAt: { type: Date, default: Date.now }
});

export const WeatherData = mongoose.model("WeatherData", WeatherDataSchema);
