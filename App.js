import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import RecordsScreen from './screens/RecordsScreen';
import EduScreen from './screens/EduScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Appointments" component={AppointmentScreen} />
        <Stack.Screen name="Records" component={RecordsScreen} />
        <Stack.Screen name="Education" component={EduScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
