import React from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * A lightweight image component that defers loading until the image is near
 * the viewport (native lazy loading) and decodes asynchronously.
 */
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};

export default LazyImage;
