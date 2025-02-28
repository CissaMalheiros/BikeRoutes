import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CadastroScreen from './CadastroScreen';
import LoginScreen from './LoginScreen';
import WelcomeScreen from './WelcomeScreen';
import { createTables } from './database'; // Importar a função de criação de tabelas
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [showHome, setShowHome] = useState(true);
  const [routeType, setRouteType] = useState(null);

  const startTracking = (type) => {
    setRouteType(type);
    setShowHome(false);
    navigation.navigate('Tracking', { routeType: type });
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.homeContainer}
    >
      <Text style={styles.homeTitle}>Bike Tracker</Text>
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
    </ImageBackground>
  );
}

function TrackingScreen({ route }) {
  const { routeType } = route.params;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const timerRef = useRef(null);
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }
    })();
  }, []);

  useEffect(() => {
    if (isTracking && !isPaused) {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          setRouteCoords((prevRoute) => [...prevRoute, newLocation]);

          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      ).then(subscription => {
        locationSubscription.current = subscription;
      });
    } else if (!isTracking || isPaused) {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    }
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [isTracking, isPaused]);

  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isTracking || isPaused) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTracking, isPaused]);

  const startTracking = () => {
    setIsTracking(true);
    setIsPaused(false);
  };

  const pauseTracking = () => {
    setIsPaused(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    setShowSummary(true);
  };

  const resetTracking = () => {
    setSeconds(0);
    setRouteCoords([]);
    setShowSummary(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  let text = 'Aguardando...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude.toFixed(6)}, Longitude: ${location.coords.longitude.toFixed(6)}`;
  }

  if (showSummary) {
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo do Trajeto</Text>
        <Text style={styles.summaryText}>Tipo de Trajeto: {routeType}</Text>
        <MapView
          style={styles.miniMap}
          region={{
            latitude: routeCoords.length > 0 ? routeCoords[0].coords.latitude : -23.5505,
            longitude: routeCoords.length > 0 ? routeCoords[0].coords.longitude : -46.6333,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {routeCoords.length > 0 && (
            <>
              <Marker coordinate={routeCoords[routeCoords.length - 1].coords} />
              <Polyline
                coordinates={routeCoords.map((loc) => loc.coords)}
                strokeColor="#FF6B6B"
                strokeWidth={4}
              />
            </>
          )}
        </MapView>
        <Text style={styles.summaryText}>Tempo total: {formatTime(seconds)}</Text>
        <TouchableOpacity style={styles.summaryButton} onPress={resetTracking}>
          <Text style={styles.summaryButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: location ? location.coords.latitude : -23.5505,
          longitude: location ? location.coords.longitude : -46.6333,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        customMapStyle={mapStyle}
      >
        {location && <Marker coordinate={location.coords} />}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords.map((loc) => loc.coords)}
            strokeColor="#FF6B6B"
            strokeWidth={4}
          />
        )}
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{text}</Text>
        <Text style={styles.timerText}>Tempo de percurso: {formatTime(seconds)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isTracking && !isPaused ? styles.buttonDisabled : null]}
          onPress={startTracking}
          disabled={isTracking && !isPaused}
        >
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isTracking || isPaused ? styles.buttonDisabled : null]}
          onPress={pauseTracking}
          disabled={!isTracking || isPaused}
        >
          <Text style={styles.buttonText}>Pausar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isTracking ? styles.buttonDisabled : null]}
          onPress={stopTracking}
          disabled={!isTracking}
        >
          <Text style={styles.buttonText}>Parar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapStyle = [
  // ... (mantenha o mesmo estilo do mapa)
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  map: {
    width: '100%',
    height: '60%',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  homeSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  homeButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  miniMap: {
    width: '100%',
    height: '40%',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 20,
  },
  summaryButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    marginTop: 10,
  },
  summaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default function App() {
  useEffect(() => {
    createTables(); // Chamar a função para criar as tabelas
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}