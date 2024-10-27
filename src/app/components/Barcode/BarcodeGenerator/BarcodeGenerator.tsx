import { BrowserQRCodeSvgWriter } from '@zxing/browser'; // For generating QR codes and barcodes
import React from 'react';

const QrGenerator: React.FC<{ text: string; size: number }> = ({ text, size }) => {
  const qrCodeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const qrCodeElement = qrCodeRef.current;
    if (qrCodeElement) {
      // Clear previous QR code
      qrCodeElement.innerHTML = '';

      try {
        const writer = new BrowserQRCodeSvgWriter();
        writer.writeToDom(qrCodeElement, text, size, size);

        const svgElement = qrCodeElement.querySelector('svg');
        if (svgElement) {
          const rectElements = svgElement.querySelectorAll('rect');

          // Calculate dynamic offset by determining the smallest x and y values
          let minX = Number.MAX_VALUE;
          let minY = Number.MAX_VALUE;
          rectElements.forEach((rect) => {
            const x = parseFloat(rect.getAttribute('x') || '0');
            const y = parseFloat(rect.getAttribute('y') || '0');
            if (x < minX) minX = x;
            if (y < minY) minY = y;
          });

          // Adjust each <rect> to remove the quiet zone dynamically based on the smallest x and y
          rectElements.forEach((rect) => {
            const x = parseFloat(rect.getAttribute('x') || '0') - minX;
            const y = parseFloat(rect.getAttribute('y') || '0') - minY;
            rect.setAttribute('x', x.toString());
            rect.setAttribute('y', y.toString());
          });

          // Dynamically calculate the new viewBox based on rect dimensions
          const totalWidth = size - 2 * minX;
          const totalHeight = size - 2 * minY;

          // Set dynamic width, height, and viewBox for the svg
          svgElement.setAttribute('width', size.toString());
          svgElement.setAttribute('height', size.toString());
          svgElement.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  }, [text, size]);

  return <div ref={qrCodeRef} className="flex w-fit p-1" />;
};

export { QrGenerator };
