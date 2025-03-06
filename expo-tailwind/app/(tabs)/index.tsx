import { View, StyleSheet, ScrollView, useColorScheme, Text } from 'react-native';
import { mockStations } from '../../data/stations';
import StationCard from '../../components/StationCard';
import { MapPin } from 'lucide-react-native';

export default function StationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const onlineCount = mockStations.filter(s => s.status === 'online').length;
  const offlineCount = mockStations.filter(s => s.status === 'offline').length;
  const maintenanceCount = mockStations.filter(s => s.status === 'maintenance').length;

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#000000' : '#f5f5f5' }
    ]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MapPin size={28} color={isDark ? '#3b82f6' : '#2563eb'} />
            <Text style={[
              styles.title,
              { color: isDark ? '#ffffff' : '#000000' }
            ]}>
              Estaciones
            </Text>
          </View>
          <Text style={[
            styles.subtitle,
            { color: isDark ? '#a1a1aa' : '#71717a' }
          ]}>
            Monitoreo en tiempo real
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1a1b1e' : '#ffffff' }]}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>{onlineCount}</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>En Línea</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1a1b1e' : '#ffffff' }]}>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>{offlineCount}</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Fuera de Línea</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1a1b1e' : '#ffffff' }]}>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>{maintenanceCount}</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Mantenimiento</Text>
          </View>
        </View>
        
        {mockStations.map((station, index) => (
          <StationCard 
            key={station.id} 
            station={station}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 36,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});