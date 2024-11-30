import { XMarkIcon } from '@heroicons/react/24/outline';
import { QrCodeIcon } from '@heroicons/react/24/solid';
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

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  scanStatus: boolean;
  scannerId: string;
}

const readerTypes = {
  QRCode: BrowserQRCodeReader,
  Aztec: BrowserAztecCodeReader,
  DataMatrix: BrowserDatamatrixCodeReader,
  MultiFormatOneD: BrowserMultiFormatOneDReader,
  MultiFormat: BrowserMultiFormatReader,
  PDF417: BrowserPDF417Reader,
};

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, scanStatus, scannerId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserCodeReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedReaderType, setSelectedReaderType] = useState<keyof typeof readerTypes>('QRCode');

  useEffect(() => {
    const fetchVideoInputDevices = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        setVideoInputDevices(devices);
        if (devices.length > 0) {
          setSelectedDeviceId(devices[0].deviceId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideoInputDevices();
  }, []);

  useEffect(() => {
    const startScanning = async () => {
      if (!selectedDeviceId) return;

      try {
        const ReaderClass = readerTypes[selectedReaderType];
        const codeReader = new ReaderClass();
        codeReaderRef.current = codeReader;

        const controls = await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current as HTMLVideoElement,
          async (result, error) => {
            if (result) {
              onScanSuccess(result.getText());
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
        console.error(err);
      }
    };

    if (scanStatus) {
      startScanning();
    } else if (controlsRef.current) {
      controlsRef.current.stop();
    }
  }, [onScanSuccess, scanStatus, selectedDeviceId, selectedReaderType]);

  return (
    <div className="flex w-full grow flex-col gap-2 rounded-box border border-base-content/50 bg-base-200 px-2 py-4">
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
      {scanStatus && <video ref={videoRef} style={{ height: 'auto' }} className="z-10 w-full grow rounded-box" />}
    </div>
  );
};

const BarcodeScannerPage: React.FC<{
  onScanComplete: (scannedContent: string) => void;
  scannerId: string;
  scanModalId: string;
}> = ({ onScanComplete, scannerId, scanModalId }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    onScanComplete(decodedText);
    setIsScanning(false);
  };

  const toggleScanning = () => {
    setIsScanning((prevState) => !prevState);
  };

  const handleClose = () => {
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
        <div className="modal-box w-4/6 max-w-5xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Scan Qr Code!</h3>
            <BarcodeScanner onScanSuccess={handleScanSuccess} scanStatus={isScanning} scannerId={scannerId} />
            <button className={`btn btn-sm ${isScanning ? 'btn-warning' : 'btn-success'}`} onClick={toggleScanning}>
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </button>
          </div>
          <div className="modal-action">
            <button className="btn btn-circle btn-sm absolute right-2 top-2 p-1" onClick={handleClose}>
              <XMarkIcon className="h-6 w-6 text-base-content" />
            </button>
            <button className="btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export { BarcodeScanner, BarcodeScannerPage };
