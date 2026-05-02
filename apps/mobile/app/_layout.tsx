import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider, useSession } from '../src/providers/SessionProvider';
import { usePushRegistration } from '../src/hooks/usePushRegistration';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';

function RootGate() {
  const { state, bootstrap } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const t = useTheme();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (state.status === 'loading') return;

    const inAuthGroup = segments[0] === 'onboarding';

    if (state.status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (state.status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/onboarding');
    }
  }, [state.status, segments, router]);

  usePushRegistration();

  return (
    <>
      <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SessionProvider>
            <RootGate />
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
