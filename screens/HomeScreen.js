// Tela inicial após login, permite iniciar registro de rotas e sincronizar manualmente
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { sincronizarComAPI } from '../database';
import styles from '../styles/styles.js';

export default function HomeScreen({ route, navigation }) {
  const { userId } = route.params;

  // Navega para a tela de registro de trajeto, passando o tipo
  const startTracking = (type) => {
    navigation.navigate('Tracking', { routeType: type, userId });
  };

  // Nova função para sincronização manual com feedback
  const handleSync = () => {
    sincronizarComAPI(
      (msg) => Alert.alert('Sincronização', msg || 'Sincronização concluída!'),
      (err) => Alert.alert('Erro de Sincronização', err || 'Erro ao sincronizar.'),
      (nothingMsg) => Alert.alert('Sincronização', nothingMsg || 'Tudo já está sincronizado!')
    );
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.homeContainer}>
      <Text style={styles.homeTitle}>BikeRoutes</Text>
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
      <TouchableOpacity style={[styles.homeButton, {backgroundColor: '#2196F3'}]} onPress={handleSync}>
        <Text style={styles.homeButtonText}>Sincronizar Manualmente</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}