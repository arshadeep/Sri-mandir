import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    // Request notification permissions on mount
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/welcome" />
        <Stack.Screen name="onboarding/deity-selection" />
        <Stack.Screen name="onboarding/reminder-setup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="ritual/prepare" />
        <Stack.Screen name="ritual/breathing" />
        <Stack.Screen name="ritual/puja" />
        <Stack.Screen name="ritual/darshan" />
        <Stack.Screen name="ritual/wisdom" />
        <Stack.Screen name="ritual/closure" />
        <Stack.Screen name="ritual/seva" />
        <Stack.Screen name="streaks" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="settings/reminder" />
        <Stack.Screen name="settings/deity-preferences" />
      </Stack>
    </GestureHandlerRootView>
  );
}
