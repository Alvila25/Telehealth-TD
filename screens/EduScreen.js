import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EduScreen() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await axios.get('https://telehealth-tcd.herokuapp.com/api/content/edu', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent(res.data);
        await AsyncStorage.setItem('eduContent', JSON.stringify(res.data)); // Offline cache
      } catch (error) {
        const cached = await AsyncStorage.getItem('eduContent');
        if (cached) setContent(JSON.parse(cached));
      }
    };
    fetchContent();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Educational Content</Text>
      {content.map((item) => (
        <View key={item.id}>
          <Text>{item.title} ({item.language})</Text>
          <Text>{item.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
