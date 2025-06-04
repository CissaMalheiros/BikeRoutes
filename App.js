import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { useAutoSync } from './useAutoSync';
import { createTables } from './database/index';

export default function App() {
  React.useEffect(() => {
    createTables(); // Garante que as tabelas existem antes de qualquer operação
  }, []);
  useAutoSync();
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}