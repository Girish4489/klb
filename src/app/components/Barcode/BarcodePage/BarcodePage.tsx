import { QrGenerator } from '@/app/components/Barcode/BarcodeGenerator/BarcodeGenerator';
import BarcodeScanner from '@/app/components/Barcode/BarcodeScanner/BarcodeScanner';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const QrGeneratorPage: React.FC<{ content: string; size: number }> = ({ content, size = 100 }) => {
  return <QrGenerator text={content} size={size} />;
};

const BarcodeScannerPage: React.FC<{ onScanComplete: (scannedContent: string) => void }> = ({ onScanComplete }) => {
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
    (document?.getElementById('scan_modal') as HTMLDialogElement)?.close();
  };

  return (
    <section className="flex flex-col-reverse items-center gap-1">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => (document?.getElementById('scan_modal') as HTMLDialogElement)?.showModal()}
      >
        Scan Qr Code
      </button>
      <dialog id="scan_modal" className="modal">
        <div className="modal-box w-4/6 max-w-5xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Scan Qr Code!</h3>
            <BarcodeScanner onScanSuccess={handleScanSuccess} scanStatus={isScanning} />
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

export { BarcodeScannerPage, QrGeneratorPage };
