import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { sincronizarComAPI } from '../database';
import styles from '../styles/styles.js';

export default function HomeScreen({ route, navigation }) {
  const { userId } = route.params;

  const startTracking = (type) => {
    navigation.navigate('Tracking', { routeType: type, userId });
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.homeContainer}>
      <Text style={styles.homeTitle}>BykeRoutes</Text>
      <Text style={styles.homeSubtitle}>Registre suas rotas de ciclismo</Text>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('trabalho')}>
        <Text style={styles.homeButtonText}>Trabalho</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('escola')}>
        <Text style={styles.homeButtonText}>Escola</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('casa')}>
        <Text style={styles.homeButtonText}>Casa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('passeio')}>
        <Text style={styles.homeButtonText}>Passeio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.homeButton, {backgroundColor: '#2196F3'}]} onPress={sincronizarComAPI}>
        <Text style={styles.homeButtonText}>Sincronizar Manualmente</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}