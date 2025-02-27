import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { 
  X, 
  Calendar, 
  PenTool as Tool, 
  AlertTriangle, 
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

const TIME_RANGES = {
  '24h': { label: 'Últimas 24 Horas', hours: 24 },
  '7d': { label: 'Últimos 7 Días', hours: 168 },
  '30d': { label: 'Últimos 30 Días', hours: 720 }
};

export default function StationDetails({ station, onClose, theme }) {
  const [timeRange, setTimeRange] = useState('24h');
  const [timeRangeModalVisible, setTimeRangeModalVisible] = useState(false);
  const [chartData, setChartData] = useState(null);
  
  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    // Generate extended history data based on time range
    const hours = TIME_RANGES[timeRange].hours;
    const extendedHistory = Array.from({ length: hours }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      temperature: 20 + Math.sin(i / 12) * 5 + Math.random() * 2,
      humidity: 50 + Math.cos(i / 12) * 20 + Math.random() * 5
    })).reverse();

    // Format labels based on time range
    let labels = [];
    if (timeRange === '24h') {
      // Show every 4 hours for 24h view
      labels = extendedHistory.filter((_, i) => i % 4 === 0).map(h => {
        const date = new Date(h.timestamp);
        return `${date.getHours()}:00`;
      });
    } else if (timeRange === '7d') {
      // Show one label per day for 7d view
      labels = extendedHistory.filter((_, i) => i % 24 === 0).map(h => {
        const date = new Date(h.timestamp);
        return date.toLocaleDateString('es-ES', { weekday: 'short' });
      });
    } else {
      // Show one label every 5 days for 30d view
      labels = extendedHistory.filter((_, i) => i % 120 === 0).map(h => {
        const date = new Date(h.timestamp);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      });
    }

    // Sample data points to match labels
    const temperatureData = [];
    const humidityData = [];
    
    if (timeRange === '24h') {
      for (let i = 0; i < extendedHistory.length; i += 4) {
        temperatureData.push(extendedHistory[i].temperature);
        humidityData.push(extendedHistory[i].humidity);
      }
    } else if (timeRange === '7d') {
      for (let i = 0; i < extendedHistory.length; i += 24) {
        temperatureData.push(extendedHistory[i].temperature);
        humidityData.push(extendedHistory[i].humidity);
      }
    } else {
      for (let i = 0; i < extendedHistory.length; i += 120) {
        temperatureData.push(extendedHistory[i].temperature);
        humidityData.push(extendedHistory[i].humidity);
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          data: temperatureData,
          color: () => 'rgba(255, 99, 132, 1)',
          strokeWidth: 2
        },
        {
          data: humidityData,
          color: () => 'rgba(53, 162, 235, 1)',
          strokeWidth: 2
        }
      ],
      legend: ['Temperatura (°C)', 'Humedad (%)']
    });
  }, [timeRange]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAlertBackgroundColor = (type) => {
    switch (type) {
      case 'critical': return darkMode ? 'rgba(220, 38, 38, 0.3)' : 'rgba(254, 226, 226, 1)';
      case 'warning': return darkMode ? 'rgba(245, 158, 11, 0.3)' : 'rgba(254, 243, 199, 1)';
      case 'info': return darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(219, 234, 254, 1)';
      default: return darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 1)';
    }
  };

  const getAlertTextColor = (type) => {
    switch (type) {
      case 'critical': return darkMode ? 'rgba(248, 113, 113, 1)' : 'rgba(185, 28, 28, 1)';
      case 'warning': return darkMode ? 'rgba(252, 211, 77, 1)' : 'rgba(146, 64, 14, 1)';
      case 'info': return darkMode ? 'rgba(96, 165, 250, 1)' : 'rgba(30, 64, 175, 1)';
      default: return theme.text;
    }
  };

  const darkMode = theme.background === '#1a202c';

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(${darkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${darkMode ? '255, 255, <boltArtifact id="expo-weather-stations-app" title="Weather Stations Mobile App with Expo">
  }
}