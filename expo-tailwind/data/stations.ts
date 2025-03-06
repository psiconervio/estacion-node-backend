import { Station } from '../types/station';

export const mockStations: Station[] = [
  {
    id: '1',
    name: 'Estación 1',
    location: 'Sierra Nevada',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 37.8651,
      longitude: -119.5383
    },
    readings: {
      temperature: 15.2,
      humidity: 45,
      pressure: 1013,
      windSpeed: 12,
      windDirection: 'NO',
      precipitation: 0.5
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 15 + Math.random() * 5,
      humidity: 45 + Math.random() * 10
    })),
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Velocidad del viento alta detectada',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
      status: 'Operativa'
    }
  },
  // Add more stations here...
];