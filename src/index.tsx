import { NativeModules } from 'react-native';
import EwayrapidAndroid, { type Spec } from './NativeEwayrapidAndroid';

const isTurboModule = !!EwayrapidAndroid;
const RTNEwayrapidAndroid: Spec = isTurboModule
  ? EwayrapidAndroid
  : NativeModules?.EwayrapidAndroid;

export const {
  getEwayCredentials,
  prepareTransaction,
  makePayment,
  getAuthHeader,
  encryptCardDetails,
} = RTNEwayrapidAndroid;
export * from './components';
export * from './context/ewayRapidContext';
export * from './utils';

// const isFabricEnabled = !!(global as any)?.nativeFabricUIManager;
