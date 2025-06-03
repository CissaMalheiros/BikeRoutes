import NetInfo from '@react-native-community/netinfo';
import { sincronizarComAPI } from './database';
import { useEffect } from 'react';

// Hook para sincronizar automaticamente quando ficar online
export function useAutoSync() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        sincronizarComAPI();
      }
    });
    return () => unsubscribe();
  }, []);
}
