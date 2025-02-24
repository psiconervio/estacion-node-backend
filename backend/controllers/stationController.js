// legacy

export const getStations = (req, res) => {
    const stations = [
      { id: 1, name: "Estación Norte", temperature: 22 },
      { id: 2, name: "Estación Sur", temperature: 18 },
    ];
    res.json(stations);
  };
  
  export const getStationById = (req, res) => {
    const stations = [
      { id: 1, name: "Estación Norte", temperature: 22 },
      { id: 2, name: "Estación Sur", temperature: 18 },
    ];
    const station = stations.find((s) => s.id === parseInt(req.params.id));
    if (!station) return res.status(404).json({ message: "Estación no encontrada" });
    res.json(station);
  };
  