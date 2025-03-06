import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#000000' : '#f5f5f5' }
    ]}>
      <Text style={[
        styles.text,
        { color: isDark ? '#ffffff' : '#000000' }
      ]}>
        Ajustes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
});