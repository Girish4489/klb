import { QrGenerator } from '@/app/components/Barcode/BarcodeGenerator/BarcodeGenerator';
import BarcodeScanner from '@/app/components/Barcode/BarcodeScanner/BarcodeScanner';
import React, { useState } from 'react';

const QrGeneratorPage: React.FC<{ content: string; size: number }> = ({ content, size = 100 }) => {
  return <QrGenerator text={content} size={size} />;
};

const BarcodeScannerPage: React.FC<{ onScanComplete: (scannedContent: string) => void }> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    setIsScanning(false);
    onScanComplete(decodedText);
  };

  const toggleScanning = () => {
    setIsScanning((prevState) => !prevState);
  };

  return (
    <section className="flex flex-col-reverse items-center gap-1">
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-secondary btn-sm m-1">
          Scan Qr Code
        </div>
        <div
          tabIndex={0}
          className="card dropdown-content card-compact z-[30] w-fit bg-base-300 p-2 text-base-content shadow"
        >
          <div className="card-body w-fit">
            <h3 className="card-title">Scan Qr Code!</h3>
            <BarcodeScanner onScanSuccess={handleScanSuccess} scanStatus={isScanning} />
            <button className={`btn btn-sm ${isScanning ? 'btn-warning' : 'btn-success'}`} onClick={toggleScanning}>
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BarcodeScannerPage, QrGeneratorPage };
