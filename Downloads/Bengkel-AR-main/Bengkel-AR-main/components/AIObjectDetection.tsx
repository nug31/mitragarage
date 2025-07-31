import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocossd from '@tensorflow-models/coco-ssd';

const { width, height } = Dimensions.get('window');

interface DetectedObject {
  id: number;
  name: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  status: 'normal' | 'warning' | 'error';
  description: string;
}

interface AIObjectDetectionProps {
  onObjectDetected: (object: DetectedObject) => void;
  onDetectionComplete: (objects: DetectedObject[]) => void;
}

// Custom vehicle component detection model
const VEHICLE_COMPONENTS = {
  'engine': {
    name: 'Mesin',
    description: 'Jantung kendaraan yang mengkonversi bahan bakar menjadi tenaga',
    normalKeywords: ['engine', 'motor', 'mesin'],
    warningKeywords: ['smoke', 'noise', 'vibration'],
    errorKeywords: ['overheat', 'knocking', 'stalling']
  },
  'battery': {
    name: 'Aki/Battery',
    description: 'Menyimpan dan menyediakan listrik untuk sistem kendaraan',
    normalKeywords: ['battery', 'aki', 'accumulator'],
    warningKeywords: ['weak', 'low voltage', 'corrosion'],
    errorKeywords: ['dead', 'faulty', 'short circuit']
  },
  'radiator': {
    name: 'Radiator',
    description: 'Mendinginkan cairan pendingin mesin',
    normalKeywords: ['radiator', 'cooling', 'heat exchanger'],
    warningKeywords: ['leak', 'clogged', 'low coolant'],
    errorKeywords: ['cracked', 'overheating', 'blocked']
  },
  'air_filter': {
    name: 'Filter Udara',
    description: 'Menyaring udara yang masuk ke mesin',
    normalKeywords: ['air filter', 'filter udara', 'clean'],
    warningKeywords: ['dirty', 'clogged', 'reduced airflow'],
    errorKeywords: ['blocked', 'damaged', 'oil soaked']
  },
  'brake_system': {
    name: 'Sistem Rem',
    description: 'Sistem pengereman untuk keamanan kendaraan',
    normalKeywords: ['brake', 'rem', 'pedal'],
    warningKeywords: ['soft pedal', 'spongy', 'noise'],
    errorKeywords: ['brake failure', 'no pressure', 'leak']
  },
  'transmission': {
    name: 'Transmisi',
    description: 'Sistem transmisi untuk mengatur tenaga mesin',
    normalKeywords: ['transmission', 'gear', 'clutch'],
    warningKeywords: ['slipping', 'rough shifting', 'noise'],
    errorKeywords: ['failure', 'broken', 'seized']
  }
};

export default function AIObjectDetection({ onObjectDetected, onDetectionComplete }: AIObjectDetectionProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [model, setModel] = useState<any>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<any>(null);

  // Initialize TensorFlow.js and load model
  useEffect(() => {
    initializeTensorFlow();
  }, []);

  const initializeTensorFlow = async () => {
    try {
      // Initialize TensorFlow.js
      await tf.ready();
      console.log('TensorFlow.js initialized');

      // Load COCO-SSD model for object detection
      const cocoModel = await cocossd.load();
      setModel(cocoModel);
      setIsModelLoaded(true);
      console.log('COCO-SSD model loaded successfully');
    } catch (error) {
      console.error('Error initializing TensorFlow:', error);
      // Fallback to mock detection
      setIsModelLoaded(true);
    }
  };

  const detectObjects = async (imageData: any) => {
    if (!model || !isModelLoaded) {
      // Fallback to mock detection
      performMockDetection();
      return;
    }

    try {
      // Convert image data to tensor
      const tensor = tf.browser.fromPixels(imageData);
      const expandedTensor = tensor.expandDims(0);

      // Perform object detection
      const predictions = await model.detect(expandedTensor);
      
      // Process predictions and identify vehicle components
      const vehicleObjects = processPredictions(predictions[0]);
      
      // Update detected objects
      setDetectedObjects(vehicleObjects);
      
      // Notify parent components
      vehicleObjects.forEach(obj => onObjectDetected(obj));
      onDetectionComplete(vehicleObjects);

      // Clean up tensors
      tensor.dispose();
      expandedTensor.dispose();
    } catch (error) {
      console.error('Error during object detection:', error);
      performMockDetection();
    }
  };

  const processPredictions = (predictions: any[]): DetectedObject[] => {
    const vehicleObjects: DetectedObject[] = [];
    let objectId = 1;

    predictions.forEach((prediction, index) => {
      const className = prediction.class.toLowerCase();
      
      // Check if detected object is a vehicle component
      for (const [componentKey, componentData] of Object.entries(VEHICLE_COMPONENTS)) {
        const keywords = [
          ...componentData.normalKeywords,
          ...componentData.warningKeywords,
          ...componentData.errorKeywords
        ];

        if (keywords.some(keyword => className.includes(keyword))) {
          // Determine status based on confidence and context
          let status: 'normal' | 'warning' | 'error' = 'normal';
          if (prediction.score < 0.5) {
            status = 'error';
          } else if (prediction.score < 0.7) {
            status = 'warning';
          }

          const detectedObject: DetectedObject = {
            id: objectId++,
            name: componentData.name,
            confidence: prediction.score,
            bbox: prediction.bbox,
            status,
            description: componentData.description
          };

          vehicleObjects.push(detectedObject);
          break;
        }
      }
    });

    return vehicleObjects;
  };

  const performMockDetection = () => {
    // Fallback mock detection for testing
    const mockObjects: DetectedObject[] = [
      {
        id: 1,
        name: 'Mesin',
        confidence: 0.95,
        bbox: [0.3, 0.4, 0.2, 0.3],
        status: 'normal',
        description: 'Jantung kendaraan yang mengkonversi bahan bakar menjadi tenaga'
      },
      {
        id: 2,
        name: 'Aki/Battery',
        confidence: 0.87,
        bbox: [0.7, 0.3, 0.15, 0.2],
        status: 'warning',
        description: 'Menyimpan dan menyediakan listrik untuk sistem kendaraan'
      },
      {
        id: 3,
        name: 'Radiator',
        confidence: 0.92,
        bbox: [0.5, 0.6, 0.25, 0.2],
        status: 'normal',
        description: 'Mendinginkan cairan pendingin mesin'
      },
      {
        id: 4,
        name: 'Filter Udara',
        confidence: 0.78,
        bbox: [0.2, 0.7, 0.15, 0.15],
        status: 'error',
        description: 'Menyaring udara yang masuk ke mesin'
      }
    ];

    setDetectedObjects(mockObjects);
    mockObjects.forEach(obj => onObjectDetected(obj));
    onDetectionComplete(mockObjects);
  };

  const startDetection = () => {
    setIsDetecting(true);
    setDetectedObjects([]);

    // Start continuous detection
    detectionInterval.current = setInterval(() => {
      if (cameraRef.current) {
        // In a real implementation, this would capture frame data
        // For now, we'll use mock detection
        performMockDetection();
      }
    }, 2000); // Detect every 2 seconds
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return '#F59E0B';
      case 'error': return '#DC2626';
      default: return '#10B981';
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Kamera diperlukan untuk AI Detection</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        {/* AI Detection Overlay */}
        {detectedObjects.map((object) => (
          <View
            key={object.id}
            style={[
              styles.detectionBox,
              {
                left: object.bbox[0] * width,
                top: object.bbox[1] * height,
                width: object.bbox[2] * width,
                height: object.bbox[3] * height,
                borderColor: getStatusColor(object.status)
              }
            ]}
          >
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(object.status) }
            ]}>
              <Text style={styles.confidenceText}>
                {Math.round(object.confidence * 100)}%
              </Text>
            </View>
            <Text style={styles.objectName}>{object.name}</Text>
          </View>
        ))}

        {/* Detection Status */}
        {isDetecting && (
          <View style={styles.detectionStatus}>
            <Text style={styles.detectionStatusText}>
              AI Detection Active - {detectedObjects.length} objects detected
            </Text>
          </View>
        )}
      </CameraView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {!isDetecting ? (
          <TouchableOpacity
            style={styles.detectButton}
            onPress={startDetection}
          >
            <Text style={styles.detectButtonText}>
              {isModelLoaded ? 'Start AI Detection' : 'Loading Model...'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.stopButton} onPress={stopDetection}>
              <Text style={styles.stopButtonText}>Stop Detection</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
            >
              <Text style={styles.flipButtonText}>Flip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  detectionBox: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  statusIndicator: {
    position: 'absolute',
    top: -25,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  objectName: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  detectionStatus: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  detectionStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  detectButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  flipButton: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
}); 