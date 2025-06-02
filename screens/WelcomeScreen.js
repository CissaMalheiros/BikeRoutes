import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import styles from '../styles/styles.js';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground source={require('../assets/background2.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao BykeRoutes</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.buttonText}>Cadastro</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}