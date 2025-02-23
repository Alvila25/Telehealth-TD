import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgoraUIKit from 'react-native-agora';
import io from 'socket.io-client';

const socket = io('https://telehealth-tcd.herokuapp.com');

export default function AppointmentScreen() {
  const [doctors, setDoctors] = useState([]);
  const [inCall, setInCall] = useState(false);
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://telehealth-tcd.herokuapp.com/api/appointments/queue', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    };
    fetchDoctors();

    socket.on('chat', (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off('chat');
  }, []);

  const bookAndCall = async (doctorId) => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.post(
      'https://telehealth-tcd.herokuapp.com/api/appointments/book',
      { doctorId, date: new Date() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const room = `${res.data.id}`;
    setChatRoom(room);
    socket.emit('join', room);
    setInCall(true);
  };

  const agoraProps = {
    connectionData: { appId: 'YOUR_AGORA_APP_ID', channel: chatRoom || 'telehealth-tcd' },
    rtcCallbacks: { EndCall: () => setInCall(false) },
  };

  return (
    <View style={styles.container}>
      {inCall ? (
        <AgoraUIKit connectionData={agoraProps.connectionData} rtcCallbacks={agoraProps.rtcCallbacks} />
      ) : (
        <>
          <Text>Doctor Queue</Text>
          {doctors.map((doc) => (
            <View key={doc.id}>
              <Text>{doc.name} - {doc.available ? 'Available' : 'Busy'}</Text>
              <Button title="Book & Call" onPress={() => bookAndCall(doc.id)} />
            </View>
          ))}
        </>
      )}
      {chatRoom && messages.map((msg, i) => <Text key={i}>{msg}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
