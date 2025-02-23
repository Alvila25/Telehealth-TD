import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Telehealth-TD, population!</Text>
      <Button title="Appointments" onPress={() => navigation.navigate('Appointments')} />
      <Button title="Records" onPress={() => navigation.navigate('Records')} />
      <Button title="Education" onPress={() => navigation.navigate('Education')} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
