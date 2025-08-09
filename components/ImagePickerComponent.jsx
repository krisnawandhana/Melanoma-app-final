import React from 'react';
import { Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ onImagePicked, selectedImage }) => {
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            onImagePicked(result.assets[0].uri);
        }
    };

    return (
        <>
            <Button title="Pilih Gambar" onPress={pickImage} />
            {selectedImage && (
                <Image 
                    source={{ uri: selectedImage }} 
                    style={styles.image} 
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
});

export default ImagePickerComponent;