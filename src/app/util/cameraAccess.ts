import handleError from './error/handleError';

export const checkCameraAccess = async (): Promise<boolean> => {
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });

    // Handle different permission states
    if (permissionStatus.state === 'granted') {
      return true;
    } else if (permissionStatus.state === 'prompt') {
      // Try accessing the camera to trigger the permission prompt
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        return true; // If the prompt is accepted
      } catch (err) {
        console.error(err);
        handleError.toast(new Error('Camera access denied. Please allow access to start scanning.'));
        return false;
      }
    } else if (permissionStatus.state === 'denied') {
      // Denied: Inform the user how to enable it
      handleError.toast(
        new Error('Camera access is blocked. Please allow access from your browser settings to enable scanning.'),
      );
      return false;
    }

    return false;
  } catch (err) {
    handleError.toast(err);
    return false;
  }
};
