import React, { useState } from 'react';
import { Search, MapPin, Settings, BarChart2, Bell, Filter } from 'lucide-react';
import StationCard from './components/StationCard';
import StationDetails from './components/StationDetails';
import type { WeatherStation } from './types';

const mockStations: WeatherStation[] = [
  {
    id: '1',
    name: 'Mountain Peak Station',
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
      windDirection: 'NW',
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
        message: 'High wind speeds detected',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '2',
    name: 'Coastal Monitor',
    location: 'Pacific Coast',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    readings: {
      temperature: 22.8,
      humidity: 78,
      pressure: 1015,
      windSpeed: 18,
      windDirection: 'SW',
      precipitation: 0
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 22 + Math.random() * 5,
      humidity: 75 + Math.random() * 10
    })),
    alerts: [],
    maintenance: {
      lastCheck: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 20 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '3',
    name: 'Desert Observatory',
    location: 'Mojave Desert',
    status: 'maintenance',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 35.0117,
      longitude: -115.4739
    },
    readings: {
      temperature: 32.5,
      humidity: 15,
      pressure: 1010,
      windSpeed: 8,
      windDirection: 'SE',
      precipitation: 0
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 30 + Math.random() * 5,
      humidity: 15 + Math.random() * 5
    })),
    alerts: [
      {
        id: '2',
        type: 'info',
        message: 'Scheduled maintenance in progress',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 1 * 24 * 3600000).toISOString(),
      status: 'Under Maintenance'
    }
  },
  {
    id: '4',
    name: 'Alpine Research Center',
    location: 'Rocky Mountains',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 40.3428,
      longitude: -105.6836
    },
    readings: {
      temperature: 5.7,
      humidity: 62,
      pressure: 985,
      windSpeed: 25,
      windDirection: 'NE',
      precipitation: 1.2
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 5 + Math.random() * 3,
      humidity: 60 + Math.random() * 8
    })),
    alerts: [],
    maintenance: {
      lastCheck: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 25 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '5',
    name: 'Tropical Station',
    location: 'Hawaii',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 19.8968,
      longitude: -155.5828
    },
    readings: {
      temperature: 27.3,
      humidity: 85,
      pressure: 1012,
      windSpeed: 15,
      windDirection: 'E',
      precipitation: 2.5
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 27 + Math.random() * 2,
      humidity: 85 + Math.random() * 5
    })),
    alerts: [
      {
        id: '3',
        type: 'warning',
        message: 'Heavy rainfall expected',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 8 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 22 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '6',
    name: 'Arctic Research',
    location: 'Alaska',
    status: 'offline',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 68.7692,
      longitude: -148.7266
    },
    readings: {
      temperature: -15.8,
      humidity: 70,
      pressure: 1020,
      windSpeed: 30,
      windDirection: 'N',
      precipitation: 0.1
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: -15 + Math.random() * 4,
      humidity: 70 + Math.random() * 7
    })),
    alerts: [
      {
        id: '4',
        type: 'critical',
        message: 'Connection lost - extreme conditions',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 10 * 24 * 3600000).toISOString(),
      status: 'Needs Attention'
    }
  },
  {
    id: '7',
    name: 'Forest Monitor',
    location: 'Amazon Rainforest',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: -3.4653,
      longitude: -62.2159
    },
    readings: {
      temperature: 29.8,
      humidity: 92,
      pressure: 1011,
      windSpeed: 5,
      windDirection: 'SE',
      precipitation: 4.2
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 29 + Math.random() * 3,
      humidity: 90 + Math.random() * 5
    })),
    alerts: [],
    maintenance: {
      lastCheck: new Date(Date.now() - 12 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 18 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '8',
    name: 'Urban Climate Center',
    location: 'New York City',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    readings: {
      temperature: 18.5,
      humidity: 55,
      pressure: 1013,
      windSpeed: 10,
      windDirection: 'SW',
      precipitation: 0
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 18 + Math.random() * 4,
      humidity: 55 + Math.random() * 8
    })),
    alerts: [],
    maintenance: {
      lastCheck: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 23 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '9',
    name: 'Mediterranean Monitor',
    location: 'Greek Islands',
    status: 'maintenance',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 37.0902,
      longitude: 25.1540
    },
    readings: {
      temperature: 24.6,
      humidity: 65,
      pressure: 1014,
      windSpeed: 20,
      windDirection: 'S',
      precipitation: 0
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 24 + Math.random() * 3,
      humidity: 65 + Math.random() * 7
    })),
    alerts: [
      {
        id: '5',
        type: 'info',
        message: 'Routine calibration in progress',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 25 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
      status: 'Under Maintenance'
    }
  },
  {
    id: '10',
    name: 'Sahara Observatory',
    location: 'Sahara Desert',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 23.4162,
      longitude: 25.6628
    },
    readings: {
      temperature: 41.2,
      humidity: 8,
      pressure: 1008,
      windSpeed: 15,
      windDirection: 'E',
      precipitation: 0
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 40 + Math.random() * 5,
      humidity: 8 + Math.random() * 3
    })),
    alerts: [
      {
        id: '6',
        type: 'warning',
        message: 'Extreme heat conditions',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 18 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 12 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '11',
    name: 'Antarctic Base',
    location: 'Antarctica',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: -82.8628,
      longitude: -135.0000
    },
    readings: {
      temperature: -45.3,
      humidity: 35,
      pressure: 1025,
      windSpeed: 40,
      windDirection: 'S',
      precipitation: 0.05
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: -45 + Math.random() * 3,
      humidity: 35 + Math.random() * 5
    })),
    alerts: [
      {
        id: '7',
        type: 'warning',
        message: 'Extreme cold warning',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 40 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 50 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  },
  {
    id: '12',
    name: 'Highland Station',
    location: 'Scottish Highlands',
    status: 'online',
    lastUpdate: new Date().toISOString(),
    coordinates: {
      latitude: 56.8198,
      longitude: -5.1052
    },
    readings: {
      temperature: 12.4,
      humidity: 80,
      pressure: 998,
      windSpeed: 35,
      windDirection: 'W',
      precipitation: 2.8
    },
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 12 + Math.random() * 3,
      humidity: 80 + Math.random() * 8
    })),
    alerts: [],
    maintenance: {
      lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
      status: 'Operational'
    }
  }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stations] = useState<WeatherStation[]>(mockStations);
  const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || station.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAlerts = stations.reduce((sum, station) => sum + station.alerts.length, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">WeatherStation Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {totalAlerts > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalAlerts}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <BarChart2 className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations by name or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Stations</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm">Total Stations</h3>
            <p className="text-2xl font-bold">{stations.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm">Online Stations</h3>
            <p className="text-2xl font-bold text-green-600">
              {stations.filter(s => s.status === 'online').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm">Offline Stations</h3>
            <p className="text-2xl font-bold text-red-600">
              {stations.filter(s => s.status === 'offline').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm">Under Maintenance</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {stations.filter(s => s.status === 'maintenance').length}
            </p>
          </div>
        </div>

        {/* Weather Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map(station => (
            <StationCard
              key={station.id}
              station={station}
              onViewDetails={setSelectedStation}
            />
          ))}
        </div>

        {/* Station Details Modal */}
        {selectedStation && (
          <StationDetails
            station={selectedStation}
            onClose={() => setSelectedStation(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;