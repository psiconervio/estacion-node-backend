import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Modal,
  useColorScheme,
  Appearance
} from 'react-native';
import { 
  Search, 
  MapPin, 
  Settings, 
  BarChart2, 
  Bell, 
  Filter, 
  Moon, 
  Sun 
} from 'lucide-react-native';
import StationCard from './components/StationCard';
import StationDetails from './components/StationDetails';

const mockStations = [
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
  {
    id: '2',
    name: 'Estación 2',
    location: 'Costa del Pacífico',
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
      windDirection: 'SO',
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
      status: 'Operativa'
    }
  },
  {
    id: '3',
    name: 'Estación 3',
    location: 'Desierto de Mojave',
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
        message: 'Mantenimiento programado en progreso',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 1 * 24 * 3600000).toISOString(),
      status: 'En Mantenimiento'
    }
  },
  {
    id: '4',
    name: 'Estación 4',
    location: 'Montañas Rocosas',
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
      status: 'Operativa'
    }
  },
  {
    id: '5',
    name: 'Estación 5',
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
        message: 'Se espera lluvia intensa',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 8 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 22 * 24 * 3600000).toISOString(),
      status: 'Operativa'
    }
  },
  {
    id: '6',
    name: 'Estación 6',
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
        message: 'Conexión perdida - condiciones extremas',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 10 * 24 * 3600000).toISOString(),
      status: 'Requiere Atención'
    }
  },
  {
    id: '7',
    name: 'Estación 7',
    location: 'Amazonas',
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
      status: 'Operativa'
    }
  },
  {
    id: '8',
    name: 'Estación 8',
    location: 'Nueva York',
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
      windDirection: 'SO',
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
      status: 'Operativa'
    }
  },
  {
    id: '9',
    name: 'Estación 9',
    location: 'Islas Griegas',
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
        message: 'Calibración rutinaria en progreso',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 25 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
      status: 'En Mantenimiento'
    }
  },
  {
    id: '10',
    name: 'Estación 10',
    location: 'Desierto del Sahara',
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
        message: 'Condiciones de calor extremo',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 18 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 12 * 24 * 3600000).toISOString(),
      status: 'Operativa'
    }
  },
  {
    id: '11',
    name: 'Estación 11',
    location: 'Antártida',
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
        message: 'Advertencia de frío extremo',
        timestamp: new Date().toISOString()
      }
    ],
    maintenance: {
      lastCheck: new Date(Date.now() - 40 * 24 * 3600000).toISOString(),
      nextScheduled: new Date(Date.now() + 50 * 24 * 3600000).toISOString(),
      status: 'Operativa'
    }
  },
  {
    id: '12',
    name: 'Estación 12',
    location: 'Tierras Altas de Escocia',
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
      windDirection: 'O',
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
      status: 'Operativa'
    }
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stations] = useState(mockStations);
  const [selectedStation, setSelectedStation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return Appearance.getColorScheme() === 'dark';
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || station.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAlerts = stations.reduce((sum, station) => sum + station.alerts.length, 0);
  const onlineStations = stations.filter(s => s.status === 'online').length;
  const offlineStations = stations.filter(s => s.status === 'offline').length;
  const maintenanceStations = stations.filter(s => s.status === 'maintenance').length;

  const theme = {
    background: darkMode ? '#1a202c' : '#f7fafc',
    card: darkMode ? '#2d3748' : '#ffffff',
    text: darkMode ? '#e2e8f0' : '#1a202c',
    textSecondary: darkMode ? '#a0aec0' : '#718096',
    border: darkMode ? '#4a5568' : '#e2e8f0',
    primary: '#3182ce',
    success: '#38a169',
    warning: '#ecc94b',
    danger: '#e53e3e',
    info: '#4299e1'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.headerLeft}>
          <MapPin color={theme.primary} size={24} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>Estaciones Meteorológicas Pro</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleDarkMode}>
            {darkMode ? (
              <Sun color={theme.textSecondary} size={22} />
            ) : (
              <Moon color={theme.textSecondary} size={22} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.notificationContainer}>
              <Bell color={theme.textSecondary} size={22} />
              {totalAlerts > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalAlerts}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <BarChart2 color={theme.textSecondary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Settings color={theme.textSecondary} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <View style={[styles.searchBar, { backgroundColor: darkMode ? '#4a5568' : '#f1f5f9', borderColor: theme.border }]}>
          <Search color={theme.textSecondary} size={20} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar estaciones..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: darkMode ? '#4a5568' : '#f1f5f9' }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter color={theme.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total de Estaciones</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{stations.length}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>En Línea</Text>
          <Text style={[styles.statValue, { color: theme.success }]}>{onlineStations}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Fuera de Línea</Text>
          <Text style={[styles.statValue, { color: theme.danger }]}>{offlineStations}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>En Mantenimiento</Text>
          <Text style={[styles.statValue, { color: theme.warning }]}>{maintenanceStations}</Text>
        </View>
      </ScrollView>

      {/* Station Cards */}
      <ScrollView 
        style={styles.stationsContainer}
        contentContainerStyle={styles.stationsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredStations.map(station => (
          <StationCard
            key={station.id}
            station={station}
            onViewDetails={() => setSelectedStation(station)}
            theme={theme}
          />
        ))}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Filtrar Estaciones</Text>
            
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                statusFilter === 'all' && { backgroundColor: `${theme.primary}20` }
              ]}
              onPress={() => {
                setStatusFilter('all');
                setFilterModalVisible(false);
              }}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: statusFilter === 'all' ? theme.primary : theme.text }
              ]}>
                Todas las Estaciones
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                statusFilter === 'online' && { backgroundColor: `${theme.success}20` }
              ]}
              onPress={() => {
                setStatusFilter('online');
                setFilterModalVisible(false);
              }}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: statusFilter === 'online' ? theme.success : theme.text }
              ]}>
                En Línea
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                statusFilter === 'offline' && { backgroundColor: `${theme.danger}20` }
              ]}
              onPress={() => {
                setStatusFilter('offline');
                setFilterModalVisible(false);
              }}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: statusFilter === 'offline' ? theme.danger : theme.text }
              ]}>
                Fuera de Línea
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                statusFilter === 'maintenance' && { backgroundColor: `${theme.warning}20` }
              ]}
              onPress={() => {
                setStatusFilter('maintenance');
                setFilterModalVisible(false);
              }}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: statusFilter === 'maintenance' ? theme.warning : theme.text }
              ]}>
                En Mantenimiento
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Station Details Modal */}
      {selectedStation && (
        <StationDetails
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          theme={theme}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e53e3e',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  statCard: {
    width: 140,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stationsContainer: {
    flex: 1,
  },
  stationsContent: {
    padding: 12,
    paddingBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});