import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useModel from '../hooks/useModel';
import useImageClassification from '../hooks/useImageClassification';

export default function ResultClass() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { model, isLoading } = useModel();
  const { loading, result, classifyImage } = useImageClassification(model);

  const [imageUri, setImageUri] = useState(params.imageUri);
  const [errorMessage, setErrorMessage] = useState(null);
  const [reclassify, setReclassify] = useState(false);

  useEffect(() => {
    if (!imageUri) {
      Alert.alert('Error', 'Gambar tidak diterima!');
      return;
    }

    if (!model) {
      console.log("Model belum siap, menunggu...");
      return;
    }

    classifyImage(imageUri)
      .catch((error) => {
        console.error("Klasifikasi error:", error);
        setErrorMessage("Klasifikasi gagal. Silakan coba lagi.");
      });
  }, [imageUri, model, reclassify]);

  // Fungsi untuk memilih ulang gambar
  const handleReupload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setErrorMessage(null);
    }
  };

  // Fungsi untuk klasifikasi ulang gambar yang sama
  const handleReclassify = () => {
    setReclassify((prev) => !prev);
    setErrorMessage(null);
  };

  // Fungsi untuk memberikan rekomendasi berdasarkan hasil klasifikasi
  const getRecommendation = (predictedClass) => {
    switch (predictedClass.toUpperCase()) {
      case 'MELANOMA':
        return "Please check your skin to doctor for further treatment!";
      case 'NORMAL SKIN':
        return "Glad! Your skin is normal.";
      case 'MELANOCYTIC NEVI':
        return "It's just Melanocytic Nevi! But still, check with a doctor because sometimes Melanocytic Nevi can turn into Melanoma!";
      case 'OTHER SKIN CANCERS':
        return "Please check your skin to doctor for further treatment!";
      default:
        return "No recommendation available.";
    }
  };

  return (
    <View style={styles.container}>
      {/* Tombol Kembali ke Home */}
      <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.title}>DETECT YOUR SKIN!</Text>

      <Text style={styles.subtitle}>Your Skin Result</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Sedang memuat model, mohon tunggu sebentar...</Text>
        </View>
      ) : (
        <>
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
          ) : (
            <Text style={styles.errorText}>Gambar tidak ditemukan</Text>
          )}

          {loading && <ActivityIndicator size="large" color="#0000ff" />}

          {!loading && result && (
            <View style={styles.resultCard}>
                <Text 
                    style={[
                        styles.resultText, 
                        result.predictedClass.toUpperCase() === 'MELANOMA' || result.predictedClass.toUpperCase() === 'OTHER SKIN CANCERS' 
                            ? styles.dangerText 
                            : styles.safeText
                    ]}
                >
                    {`${result.predictedClass}\n${getRecommendation(result.predictedClass)}`}
                </Text>
            </View>
          )}

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          {/* Tombol untuk Reupload atau Klasifikasi Ulang */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.reuploadButton]} onPress={handleReupload}>
                <Text style={styles.buttonText}>Reupload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.reclassifyButton]} onPress={handleReclassify}>
                <Text style={styles.buttonText}>Reclassify Image</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DFF0C4', // Warna hijau muda
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
  },
  backText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'Cochin', // Gaya tulisan mirip tulisan tangan
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    width: 350,
    height: 350,
    backgroundColor: 'black', // Warna latar hitam seperti di gambar
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'contain',
  },
  resultCard: {
    backgroundColor: '#FFFFFF', // Warna biru muda
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dangerText: {
    color: 'red', // Warna merah untuk kondisi berbahaya
  },
  safeText: {
    color: 'green', // Warna hijau untuk kondisi aman
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'darkred',
    textAlign: 'center',
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Untuk efek shadow di Android
  },
  
  reuploadButton: {
    backgroundColor: '#FF5733', // Warna merah-oranye
  },
  
  reclassifyButton: {
    backgroundColor: '#4CAF50', // Warna hijau segar
  },
  
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
});

