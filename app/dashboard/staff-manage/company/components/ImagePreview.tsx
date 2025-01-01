import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, width = 128, height = 128, className }) => {
  return (
    <div className="relative">
      <Image src={src} alt={alt} width={width} height={height} className={className || 'h-32 w-32 object-contain'} />
    </div>
  );
};
