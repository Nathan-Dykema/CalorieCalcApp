//npx expo start

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LogInScreen from './screens/LogInScreen';
import TabBar from './screens/TabBar';


const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LogInScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={TabBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

