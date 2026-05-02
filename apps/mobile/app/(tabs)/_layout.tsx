import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TabsLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.colors.accent.base,
        tabBarInactiveTintColor: t.colors.text.muted,
        tabBarStyle: {
          backgroundColor: t.colors.background.surface,
          borderTopColor: t.colors.border.subtle,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: t.colors.background.app,
          borderBottomColor: t.colors.border.subtle,
          shadowColor: 'transparent',
        },
        headerShadowVisible: false,
        headerTintColor: t.colors.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        sceneStyle: {
          backgroundColor: t.colors.background.app,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gastos"
        options={{
          title: 'Gastos',
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="miembros"
        options={{
          title: 'Miembros',
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
