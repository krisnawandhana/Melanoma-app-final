import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

const CLASS_NAMES = ["OTHER SKIN CANCERS", "NORMAL SKIN", "MELANOCYTIC NEVI", "MELANOMA"];

const useImageClassification = (model) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const classifyImage = async (imageUri) => {
        if (!model) return;

        setLoading(true);
        try {
            const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
            const raw = new Uint8Array(imgBuffer);

            const imageTensor = decodeJpeg(raw)
                .resizeBilinear([180, 180])
                .expandDims(0)
                .toFloat()
                .div(tf.scalar(255.0));

            const prediction = model.predict(imageTensor);
            const predictionData = await prediction.data();
            const interpretedResult = interpretPrediction(predictionData);
            setResult(interpretedResult);
        } catch (error) {
            console.error('Kesalahan klasifikasi gambar:', error);
        } finally {
            setLoading(false);
        }
    };

    const interpretPrediction = (predictionData) => {
        const maxIndex = predictionData.reduce((bestIndex, prob, index, arr) => 
            prob > arr[bestIndex] ? index : bestIndex, 0);

        return {
            predictedClass: CLASS_NAMES[maxIndex],
            confidence: (predictionData[maxIndex] * 100).toFixed(2) + '%',
            rawPredictions: predictionData.map((conf, index) => ({
                class: CLASS_NAMES[index],
                probability: (conf * 100).toFixed(2) + '%'
            }))
        };
    };

    return { loading, result, classifyImage };
};

export default useImageClassification;
