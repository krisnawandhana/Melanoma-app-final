import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Alert } from 'react-native';

const useModel = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        tf.env().set('WEBGL_PACK_DEPTHWISECONV', false)
        const modelJson = require('../assets/model/model.json');
        const modelWeights = [
          require('../assets/model/group1-shard1of15.bin'),
          require('../assets/model/group1-shard2of15.bin'),
          require('../assets/model/group1-shard3of15.bin'),
          require('../assets/model/group1-shard4of15.bin'),
          require('../assets/model/group1-shard5of15.bin'),
          require('../assets/model/group1-shard6of15.bin'),
          require('../assets/model/group1-shard7of15.bin'),
          require('../assets/model/group1-shard8of15.bin'),
          require('../assets/model/group1-shard9of15.bin'),
          require('../assets/model/group1-shard10of15.bin'),
          require('../assets/model/group1-shard11of15.bin'),
          require('../assets/model/group1-shard12of15.bin'),
          require('../assets/model/group1-shard13of15.bin'),
          require('../assets/model/group1-shard14of15.bin'),
          require('../assets/model/group1-shard15of15.bin')
        ];

        const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
        Alert.alert('Kesalahan', 'Gagal memuat model ML');
      } finally {
        setIsLoading(false); // Hentikan loading setelah model selesai dimuat
      }
    };

    loadModel();
  }, []);

  return { model, isLoading };
};

export default useModel;
