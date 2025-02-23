import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('login');

  const handleLogin = async () => {
    try {
      await axios.post('https://telehealth-tcd.herokuapp.com/api/auth/login', { phone, password });
      setStep('2fa');
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  const handle2FA = async () => {
    try {
      const res = await axios.post('https://telehealth-tcd.herokuapp.com/api/auth/verify-2fa', { phone, code });
      await AsyncStorage.setItem('token', res.data.token);
      navigation.navigate('Home');
    } catch (error) {
      console.log('2FA failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Telehealth-TCD Login</Text>
      {step === 'login' ? (
        <>
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title="Login" onPress={handleLogin} />
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="2FA Code" value={code} onChangeText={setCode} />
          <Button title="Verify" onPress={handle2FA} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginVertical: 10, padding: 10 },
});
