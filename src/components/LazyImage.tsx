import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer';
import { Image as ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  placeholder?: React.ReactNode;
}

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  onClick,
  placeholder 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  const { ref } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        setIsInView(true);
      }
    },
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const defaultPlaceholder = (
    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-500">
        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );

  const errorPlaceholder = (
    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-500">
        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Gagal memuat gambar</p>
      </div>
    </div>
  );

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {!isInView ? (
        placeholder || defaultPlaceholder
      ) : hasError ? (
        errorPlaceholder
      ) : (
        <>
          {!isLoaded && (placeholder || defaultPlaceholder)}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        </>
      )}
    </div>
  );
}

