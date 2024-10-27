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
}

const readerTypes = {
  QRCode: BrowserQRCodeReader,
  Aztec: BrowserAztecCodeReader,
  DataMatrix: BrowserDatamatrixCodeReader,
  MultiFormatOneD: BrowserMultiFormatOneDReader,
  MultiFormat: BrowserMultiFormatReader,
  PDF417: BrowserPDF417Reader,
};

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, scanStatus }) => {
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
        const dummyDevices: MediaDeviceInfo[] = [
          { deviceId: 'dummy1', label: 'Dummy Camera 1', groupId: '', kind: 'videoinput', toJSON: () => ({}) },
          { deviceId: 'dummy2', label: 'Dummy Camera 2', groupId: '', kind: 'videoinput', toJSON: () => ({}) },
        ];
        devices.push(...dummyDevices);
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
          (result, error) => {
            if (result) {
              onScanSuccess(result.getText());
              setTimeout(() => controls?.stop(), 1000);
            }
            if (error) {
              // console.error(error);
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
    <div className="flex w-fit flex-col gap-2 rounded-box border border-base-content/50 bg-base-200 px-2 py-4">
      <select
        id="readerTypeSelect"
        name="readerType"
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
          id="deviceSelect"
          name="device"
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
      {scanStatus && (
        <video
          ref={videoRef}
          style={{ height: 'auto' }}
          className="rounded-box sm:max-w-sm md:min-w-72 md:max-w-md lg:min-w-96 lg:max-w-lg xl:min-w-[32rem] xl:max-w-xl"
        />
      )}
    </div>
  );
};

export default BarcodeScanner;
