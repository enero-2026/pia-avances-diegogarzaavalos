import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { TokenStorage } from '@balancehogar/api-client';

const TOKEN_KEY = 'balancehogar.session.token';

/**
 * En iOS / Android usa Secure Store (Keychain / EncryptedSharedPreferences).
 * En web cae a AsyncStorage (no hay Secure Store disponible).
 */
export const secureTokenStorage: TokenStorage = {
  async getToken() {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(TOKEN_KEY);
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token: string) {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  },
  async clearToken() {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
