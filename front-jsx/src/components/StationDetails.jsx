import React, { useState, useMemo } from 'react';
import { X, Calendar, PenTool as Tool, AlertTriangle, ChevronDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TIME_RANGES = {
  '24h': { label: 'Últimas 24 Horas', hours: 24 },
  '7d': { label: 'Últimos 7 Días', hours: 168 },
  '30d': { label: 'Últimos 30 Días', hours: 720 }
};

export default function StationDetails({ station, onClose }) {
  const [timeRange, setTimeRange] = useState('24h');

  const extendedHistory = useMemo(() => {
    const hours = TIME_RANGES[timeRange].hours;
    return Array.from({ length: hours }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 20 + Math.sin(i / 12) * 5 + Math.random() * 2,
      humidity: 50 + Math.cos(i / 12) * 20 + Math.random() * 5
    })).reverse();
  }, [timeRange]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '7d') {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const chartData = {
    labels: extendedHistory.map(h => formatTimestamp(h.timestamp)),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: extendedHistory.map(h => h.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Humedad (%)',
        data: extendedHistory.map(h => h.humidity),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
      title: {
        display: true,
        text: `Datos Históricos - ${TIME_RANGES[timeRange].label}`,
        color: 'rgb(156, 163, 175)',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{station.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{station.location}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Coordenadas: {station.coordinates.latitude}°N, {station.coordinates.longitude}°O
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Datos Históricos</h3>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
              >
                {Object.entries(TIME_RANGES).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="h-[300px]">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white">Calendario de Mantenimiento</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span>Última Revisión:</span>{' '}
                {new Date(station.maintenance.lastCheck).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span>Próxima Programada:</span>{' '}
                {new Date(station.maintenance.nextScheduled).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span>Estado:</span>{' '}
                {station.maintenance.status}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
              <h4 className="font-semibold text-gray-800 dark:text-white">Alertas Recientes</h4>
            </div>
            <div className="space-y-2">
              {station.alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`text-sm p-2 rounded ${
                    alert.type === 'critical'
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                      : alert.type === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Tool className="h-5 w-5 mr-2" />
              <span className="text-sm">Estado del Sistema: 98%</span>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Exportar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}