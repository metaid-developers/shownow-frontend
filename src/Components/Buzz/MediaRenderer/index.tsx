import React from 'react';
import ImageRenderer from './ImageRenderer';
import VideoRenderer from './VideoRenderer';
import AudioRenderer from './AudioRenderer';
import DocumentRenderer from './DocumentRenderer';
import FileRenderer from './FileRenderer';
import { FileType, getFileType, getFileUrl, getPreviewUrl } from './utils';

interface MediaRendererProps {
  url: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({
  url,
  alt,
  className,
  style,
  onClick,
}) => {
  const fileType = getFileType(url);
  const processedUrl = fileType === FileType.IMAGE ? getPreviewUrl(url) : getFileUrl(url);

  const commonProps = {
    url: processedUrl,
    originalUrl: url,
    alt,
    className,
    style,
    onClick,
  };

  console.log('Rendering media with URL:', processedUrl, 'of type:', fileType);

  switch (fileType) {
    case FileType.IMAGE:
      return <ImageRenderer {...commonProps} />;
    
    case FileType.VIDEO:
      return <VideoRenderer {...commonProps} />;
    
    case FileType.AUDIO:
      return <AudioRenderer {...commonProps} />;
    
    case FileType.DOCUMENT:
      return <DocumentRenderer {...commonProps} />;
    
    case FileType.ARCHIVE:
    case FileType.OTHER:
    default:
      return <FileRenderer {...commonProps} />;
  }
};

export default MediaRenderer;
