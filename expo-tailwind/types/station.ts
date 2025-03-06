export interface Station {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  readings: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: string;
    precipitation: number;
  };
  history: Array<{
    timestamp: string;
    temperature: number;
    humidity: number;
  }>;
  alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }>;
  maintenance: {
    lastCheck: string;
    nextScheduled: string;
    status: string;
  };
}