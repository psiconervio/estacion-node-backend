import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { 
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Navigation,
  CloudRain,
  ExternalLink,
  AlertTriangle
} from 'lucide-react-native';

export default function StationCard({ station, onViewDetails, theme }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return theme.success;
      case 'offline': return theme.danger;
      case 'maintenance': return theme.warning;
      default: return theme.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'En Línea';
      case 'offline': return 'Fuera de Línea';
      case 'maintenance': return 'En Mantenimiento';
      default: return status;
    }
  };

  const hasActiveAlerts = station.alerts.some(
    alert => new Date(alert.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={onViewDetails}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{station.name}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{station.location}</Text>
        </View>
        <View style={styles.statusContainer}>
          {hasActiveAlerts && (
            <AlertTriangle color={theme.warning} size={16} style={styles.alertIcon} />
          )}
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(station.status) }]} />
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>
            {getStatusText(station.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.readingsContainer}>
        <View style={styles.readingItem}>
          <Thermometer color={theme.primary} size={18} />
          <View style={styles.readingTextContainer}>
            <Text style={[styles.readingLabel, { color: theme.textSecondary }]}>Temperatura</Text>
            <Text style={[styles.readingValue, { color: theme.text }]}>{station.readings.temperature}°C</Text>
          </View>
        </View>
        
        <View style={styles.readingItem}>
          <Droplets color={theme.primary} size={18} />
          <View style={styles.readingTextContainer}>
            <Text style={[styles.readingLabel, { color: theme.textSecondary }]}>Humedad</Text>
            <Text style={[styles.readingValue, { color: theme.text }]}>{station.readings.humidity}%</Text>
          </View>
        </View>
        
        <View style={styles.readingItem}>
          <Gauge color={theme.primary} size={18} />
          <View style={styles.readingTextContainer}>
            <Text style={[styles.readingLabel, { color: theme.textSecondary }]}>Presión</Text>
            <Text style={[styles.readingValue, { color: theme.text }]}>{station.readings.pressure} hPa</Text>
          </View>
        </View>
        
        <View style={styles.readingItem}>
          <Wind color={theme.primary} size={18} />
          <View style={styles.readingTextContainer}>
            <Text style={[styles.readingLabel, { color: theme.textSecondary }]}>Viento</Text>
            <Text style={[styles.readingValue, { color: theme.text }]}>{station.readings.windSpeed} km/h</Text>
          </View>
        </View>
        
        <View style={styles.readingItem}>
          <Navigation color={theme.primary} size={18} />
          <View style={styles.readingTextContainer}>
            <Text style={[styles.readingLabel, { color: theme.textSecondary }]}>Dirección</Text>
            <Text style={[styles.readingValue, { color: theme.text }]}>{station.readings.windDirection}</Text>
          </View>
        </View>
        
        <View style={styles.readingItem}>
          <CloudRain color={theme.primary} size={18} />
          <View style={styles.readingTextContainer}>
            <Text style={[styles.readingLabel, { color: theme.textSecondary }]}>Precipitación</Text>
            <Text style={[styles.readingValue, { color: theme.text }]}>{station.readings.precipitation} mm</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.updateText, { color: theme.textSecondary }]}>
          Actualizado: {formatDate(station.lastUpdate)}
        </Text>
        <View style={styles.detailsButton}>
          <Text style={[styles.detailsText, { color: theme.primary }]}>Ver Detalles</Text>
          <ExternalLink color={theme.primary} size={14} style={styles.detailsIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
  },
  readingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  readingItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  readingTextContainer: {
    marginLeft: 8,
  },
  readingLabel: {
    fontSize: 12,
  },
  readingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  updateText: {
    fontSize: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsIcon: {
    marginLeft: 4,
  },
});