import { Capacitor } from '@capacitor/core';

export const getBackendUrl = (): string => {
  const platform = Capacitor.getPlatform();

  if (platform === 'android') {
    // Use 10.0.2.2 for Android emulator to access host machine
    return 'http://10.0.2.2:8081';
  } else {
    // Use localhost for web and other platforms
    return 'http://localhost:8081';
  }
};