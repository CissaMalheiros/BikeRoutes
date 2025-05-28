import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';
import TrackingScreen from '../screens/TrackingScreen';
import UserListScreen from '../screens/UserListScreen';
import { createTables, updateDatabaseSchema } from '../database';

const Stack = createStackNavigator();

export default function StackNavigator() {
  useEffect(() => {
    const initializeDatabase = async () => {
      await createTables();
      await updateDatabaseSchema();
    };
    initializeDatabase();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tracking" component={TrackingScreen} />
      <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'Lista de Usuários' }} />
    </Stack.Navigator>
  );
}