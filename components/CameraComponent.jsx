import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const CameraComponent = ({ onCapture }) => {
  useEffect(() => {
    openCamera(); // Langsung buka kamera ketika komponen dimuat
  }, []);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Ditolak", "Aplikasi memerlukan izin kamera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onCapture(result.assets[0].uri); // Kirim gambar ke parent component
    }
  };

  return null; // Tidak perlu menampilkan UI tambahan
};

export default CameraComponent;
