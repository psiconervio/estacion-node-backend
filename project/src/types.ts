export interface WeatherStation {
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
  history: {
    timestamp: string;
    temperature: number;
    humidity: number;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'critical' | 'info';
    message: string;
    timestamp: string;
  }[];
  maintenance: {
    lastCheck: string;
    nextScheduled: string;
    status: string;
  };
}

export interface StationCard {
  station: WeatherStation;
  onViewDetails: (station: WeatherStation) => void;
}

export interface StationDetailsProps {
  station: WeatherStation;
  onClose: () => void;
}

export type TimeRange = '24h' | '7d' | '30d';