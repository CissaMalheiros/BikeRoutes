import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { useAutoSync } from './useAutoSync';

export default function App() {
  useAutoSync();
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}