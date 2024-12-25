import { XMarkIcon } from '@heroicons/react/24/outline';
import { QrCodeIcon } from '@heroicons/react/24/solid';
import { checkCameraAccess } from '@utils/cameraAccess';
import handleError from '@utils/error/handleError';
import {
  BrowserAztecCodeReader,
  BrowserCodeReader,
  BrowserDatamatrixCodeReader,
  BrowserMultiFormatOneDReader,
  BrowserMultiFormatReader,
  BrowserPDF417Reader,
  BrowserQRCodeReader,
} from '@zxing/browser';
import React, { useEffect, useRef, useState } from 'react';

const readerTypes = {
  QRCode: BrowserQRCodeReader,
  Aztec: BrowserAztecCodeReader,
  DataMatrix: BrowserDatamatrixCodeReader,
  MultiFormatOneD: BrowserMultiFormatOneDReader,
  MultiFormat: BrowserMultiFormatReader,
  PDF417: BrowserPDF417Reader,
};

const BarcodeScanner: React.FC<{
  onScanComplete: (scannedContent: string) => void;
  scannerId: string;
  scanModalId: string;
}> = ({ onScanComplete, scannerId, scanModalId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserCodeReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraAccess, setCameraAccess] = useState<boolean>(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedReaderType, setSelectedReaderType] = useState<keyof typeof readerTypes>('QRCode');

  const fetchVideoInputDevices = async (): Promise<boolean> => {
    try {
      const hasCameraAccess = await checkCameraAccess();
      setCameraAccess(hasCameraAccess);

      if (!hasCameraAccess) {
        handleError.toast(
          new Error(
            'Camera access is blocked. Please enable it in your browser settings by clicking the padlock icon in the address bar.',
          ),
        );
        return false;
      }

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (devices.length > 0) {
        setVideoInputDevices(devices);
        setSelectedDeviceId(devices[0].deviceId);
        return true;
      } else {
        handleError.toast(new Error('No video input devices found. Please check your camera setup.'));
        return false;
      }
    } catch (err) {
      console.error(err);
      handleError.toast(new Error('Failed to list video input devices. Please check your permissions.'));
      return false;
    }
  };

  useEffect(() => {
    const startScanning = async (): Promise<void> => {
      if (!selectedDeviceId || !cameraAccess) return;

      if (videoInputDevices.length === 0) {
        handleError.toast(new Error('No valid video input devices found.'));
        setIsScanning(false);
        return;
      }

      try {
        const ReaderClass = readerTypes[selectedReaderType];
        const codeReader = new ReaderClass();
        codeReaderRef.current = codeReader;

        const controls = await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current as HTMLVideoElement,
          async (result, error) => {
            if (result) {
              onScanComplete(result.getText());
              setTimeout(() => controls?.stop(), 500);
            }
            if (error) {
              // console.error(error);
            }
            if (videoRef.current) {
              try {
                await videoRef.current.play();
              } catch (playError) {
                console.error('Error attempting to play video:', playError);
              }
            }
          },
        );
        if (controls) {
          controlsRef.current = controls;
        }
      } catch (err) {
        handleError.toast(err);
      }
    };

    if (isScanning) {
      startScanning();
    } else if (controlsRef.current) {
      controlsRef.current.stop();
    }
  }, [isScanning, selectedDeviceId, selectedReaderType, onScanComplete, cameraAccess, videoInputDevices.length]);

  const toggleScanning = async (): Promise<void> => {
    const devicesAvailable = await fetchVideoInputDevices();
    if (devicesAvailable) {
      setIsScanning((prevState) => !prevState);
    }
  };

  const handleClose = (): void => {
    setIsScanning(false);
    (document?.getElementById(scanModalId) as HTMLDialogElement)?.close();
  };

  return (
    <section className="flex flex-col-reverse items-center gap-1">
      <button
        className="btn btn-secondary btn-sm text-nowrap"
        onClick={() => (document?.getElementById(scanModalId) as HTMLDialogElement)?.showModal()}
      >
        Scan
        <QrCodeIcon className="h-5 w-5" />
      </button>
      <dialog id={scanModalId} className="modal">
        <div className="modal-box border-primary/70 bg-base-300 w-4/6 max-w-5xl border">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Scan Qr Code!</h3>
            <div className="rounded-box border-primary/50 bg-neutral flex w-full grow flex-col gap-2 border px-2 py-3">
              <select
                id={`readerTypeSelect_${scannerId}`}
                name={`readerType_${scannerId}`}
                value={selectedReaderType}
                onChange={(e) => setSelectedReaderType(e.target.value as keyof typeof readerTypes)}
                className="select select-primary select-sm text-base-content"
              >
                {Object.keys(readerTypes).map((readerType) => (
                  <option key={readerType} value={readerType}>
                    {readerType}
                  </option>
                ))}
              </select>
              {videoInputDevices.length > 1 && (
                <select
                  id={`deviceSelect_${scannerId}`}
                  name={`device_${scannerId}`}
                  value={selectedDeviceId || ''}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="select select-primary select-sm text-base-content"
                >
                  {videoInputDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId}`}
                    </option>
                  ))}
                </select>
              )}
              {isScanning && (
                <video
                  ref={videoRef}
                  style={{ height: 'auto' }}
                  className="rounded-box ring-secondary z-10 w-full grow ring-2"
                />
              )}
            </div>
            <button className={`btn btn-sm ${isScanning ? 'btn-warning' : 'btn-success'}`} onClick={toggleScanning}>
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </button>
          </div>
          <div className="modal-action">
            <button className="btn btn-circle btn-sm absolute right-2 top-2 p-1" onClick={handleClose}>
              <XMarkIcon className="text-base-content h-6 w-6" />
            </button>
            <button className="btn btn-error btn-sm" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default BarcodeScanner;
