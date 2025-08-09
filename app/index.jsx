import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CameraComponent from '../components/CameraComponent';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar, Platform } from 'react-native';

export default function App() {
  const router = useRouter();
  const [useCamera, setUseCamera] = useState(false);

  const handleImageCapture = (uri) => {
    if (!uri) {
      Alert.alert('Error', 'Gambar tidak valid!');
      return;
    }
    setUseCamera(false);
    console.log("Navigating with imageUri:", uri);
    router.push({ pathname: '/resultClass', params: { imageUri: encodeURIComponent(uri) } });
  };

  return (
    <View style={styles.container}>
      {/* Icon di atas teks */}
      <Image source={require('../assets/icon/splash-icon.png')} style={styles.icon} />

      <Text style={styles.subtitle}>Choose one of these options!</Text>

      {/* Tombol untuk mengambil gambar dari kamera */}
      <TouchableOpacity style={styles.button} onPress={() => setUseCamera(true)}>
        <Ionicons name="camera-outline" size={32} color="white" />
        <Text style={styles.buttonText}>Get Skin Photo with Camera</Text>
      </TouchableOpacity>

      {/* Tombol untuk mengunggah gambar dari galeri */}
      <TouchableOpacity style={styles.button} onPress={() => {
        // Create a temporary ImagePicker instance to handle the image picking
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        }).then(result => {
          if (!result.canceled) {
            handleImageCapture(result.assets[0].uri);
          }
        }).catch(error => {
          console.log("Error picking image:", error);
          Alert.alert('Error', 'Gagal membuka galeri gambar');
        });
      }}>
        <Ionicons name="cloud-upload-outline" size={32} color="white" />
        <Text style={styles.buttonText}>Get Skin Photo with Uploading Photo</Text>
      </TouchableOpacity>

      {/* Modal kamera */}
      {useCamera && (
        <Modal visible={useCamera} transparent>
          <CameraComponent onCapture={handleImageCapture} />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#DFF0C4', // Warna hijau muda
  },
  icon: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50, // Dekat status bar
    alignSelf: 'center', // Pusatkan ikon
    width: 300, // Ukuran ikon
    height: 300,
    aspectRatio: 2.72, // Menjaga proporsi gambar
    resizeMode: 'contain', // Memastikan gambar tidak terpotong
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7EB6FF', // Warna biru seperti di desain
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Untuk Android
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
