import { StatusBar } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <>
      <StatusBar backgroundColor="rgba(0,0,0,0.2)" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="resultClass" options={{ headerShown: false }}/>
      </Stack>
    </>
  );
};

export default RootLayout;
