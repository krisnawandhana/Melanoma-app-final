import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const ResultDisplay = ({ loading, result }) => {
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!result || !result.predictedClass) {
        return <Text style={styles.placeholderText}>Tidak ada hasil prediksi</Text>;
    }

    return (
        <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
                Kelas Prediksi: {String(result.predictedClass)}
            </Text>
            <Text style={styles.confidenceText}>
                Kepercayaan: {String(result.confidence)}
            </Text>
            <Text style={styles.detailTitle}>Detail Prediksi:</Text>
            {Array.isArray(result.rawPredictions) && result.rawPredictions.length > 0 ? (
                result.rawPredictions.map((pred, index) => (
                    <Text key={index} style={styles.predictionDetail}>
                        {`${pred.class || "Unknown"}: ${String(pred.probability || 0)}`}
                    </Text>
                ))
            ) : (
                <Text style={styles.placeholderText}>Tidak ada detail prediksi</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    confidenceText: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    predictionDetail: {
        fontSize: 14,
        marginTop: 5,
    },
    placeholderText: {
        fontSize: 14,
        color: 'gray',
    },
});

export default ResultDisplay;
