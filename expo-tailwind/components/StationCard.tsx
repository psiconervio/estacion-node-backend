import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Image } from 'react-native';
import { Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Station } from '../types/station';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface StationCardProps {
  station: Station;
  index: number;
}

export default function StationCard({ station, index }: StationCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'offline': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#71717a';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En Línea';
      case 'offline': return 'Fuera de Línea';
      case 'maintenance': return 'En Mantenimiento';
      default: return status;
    }
  };

  const getWeatherImage = () => {
    const temp = station.readings.temperature;
    if (temp > 30) return 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&auto=format&fit=crop&q=60';
    if (temp < 0) return 'https://images.unsplash.com/photo-1611145434336-2cef9663b168?w=800&auto=format&fit=crop&q=60';
    return 'https://images.unsplash.com/photo-1598899246709-c8273815f3ef?w=800&auto=format&fit=crop&q=60';
  };

  return (
    <AnimatedTouchableOpacity
      entering={FadeInUp.delay(index * 100)}
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1a1b1e' : '#ffffff' }
      ]}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: getWeatherImage() }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{station.name}</Text>
            <Text style={styles.location}>{station.location}</Text>
          </View>
          <View style={styles.statusContainer}>
            {station.alerts.length > 0 && (
              <AlertTriangle size={16} color="#f59e0b" style={styles.alertIcon} />
            )}
            <View style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(station.status) }
            ]} />
            <Text style={styles.statusText}>
              {getStatusText(station.status)}
            </Text>
          </View>
        </View>

        <View style={styles.readings}>
          <View style={styles.reading}>
            <Thermometer size={24} color="#3b82f6" />
            <View style={styles.readingText}>
              <Text style={styles.readingLabel}>Temperatura</Text>
              <Text style={styles.readingValue}>
                {station.readings.temperature}°C
              </Text>
            </View>
          </View>

          <View style={styles.reading}>
            <Droplets size={24} color="#3b82f6" />
            <View style={styles.readingText}>
              <Text style={styles.readingLabel}>Humedad</Text>
              <Text style={styles.readingValue}>
                {station.readings.humidity}%
              </Text>
            </View>
          </View>

          <View style={styles.reading}>
            <Wind size={24} color="#3b82f6" />
            <View style={styles.readingText}>
              <Text style={styles.readingLabel}>Viento</Text>
              <Text style={styles.readingValue}>
                {station.readings.windSpeed} km/h
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.updateText}>
          Última actualización: {new Date(station.lastUpdate).toLocaleTimeString()}
        </Text>
      </View>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  alertIcon: {
    marginRight: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  readings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  readingText: {
    marginLeft: 8,
  },
  readingLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  readingValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  updateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'right',
  },
});