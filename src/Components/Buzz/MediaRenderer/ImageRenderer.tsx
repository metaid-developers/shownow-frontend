import React from 'react';
import { Image } from 'antd';
import { FallbackImage } from '@/config';
import { getDownloadUrl } from './utils';

interface ImageRendererProps {
  url: string;
  originalUrl?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({
  url,
  originalUrl,
  alt,
  className,
  style,
  onClick,
}) => {
    console.log('Rendering image with URL:', url);
  return (
    <Image
      src={url}
      alt={alt}
      className={className}
      style={{
        objectFit: 'cover',
        borderRadius: '8px',
        maxWidth: '100%',
        maxHeight: '400px',
        ...style,
      }}
      fallback={FallbackImage}
      onClick={onClick}
      preview={{
        mask: false,
        src: getDownloadUrl(originalUrl || url),
      }}
    />
  );
};

export default ImageRenderer;
