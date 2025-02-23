import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecordsScreen() {
  const [history, setHistory] = useState('');
  const [greenhouse, setGreenhouse] = useState('');

  const handleUpload = async () => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('medicalHistory', history);
    formData.append('telehealthData', JSON.stringify({ pesticideExposure: greenhouse }));
    await axios.post('https://telehealth-td.herokuapp.com/api/records/upload', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });
    setHistory('');
    setGreenhouse('');
  };

  return (
    <View style={styles.container}>
      <Text>Upload Records</Text>
      <TextInput style={styles.input} placeholder="Medical History" value={history} onChangeText={setHistory} />
      <TextInput style={styles.input} placeholder="telehealth Exposure" value={telehealth } onChangeText={telehealth} />
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginVertical: 10, padding: 10 },
});
