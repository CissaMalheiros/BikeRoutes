import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../styles/styles.js';
import { addRota } from '../database';
import { formatTime } from '../utils/format';

export default function TrackingScreen({ route, navigation }) {
  const { routeType, userId } = route.params;
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
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        setErrorMsg('Permissão para localização em segundo plano foi negada');
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

  const stopTracking = async () => {
    setIsTracking(false);
    setIsPaused(false);
    setShowSummary(true);
    await addRota(userId, routeType, routeCoords, formatTime(seconds));
  };

  const resetTracking = () => {
    setSeconds(0);
    setRouteCoords([]);
    setShowSummary(false);
  };

  let text = 'Aguardando...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude.toFixed(6)}, Longitude: ${location.coords.longitude.toFixed(6)}`;
  }

  if (showSummary) {
    return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: -23.5505,
                longitude: -46.6333,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
        }
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
        region={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: -23.5505,
                longitude: -46.6333,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
        }
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