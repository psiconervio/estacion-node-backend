import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
  name: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export const Station = mongoose.model("Station", StationSchema);
