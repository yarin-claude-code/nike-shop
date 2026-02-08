import { useState } from 'react';

interface ProductImageViewerProps {
  images: string[];
  productName: string;
  colors?: string[];
  defaultColor?: string;
  onColorChange?: (color: string) => void;
}

export default function ProductImageViewer({
  images,
  productName,
  colors = [],
  defaultColor,
  onColorChange,
}: ProductImageViewerProps): JSX.Element {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(defaultColor || colors[0]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleColorChange = (color: string): void => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  const handleImageChange = (index: number): void => {
    setImageLoaded(false);
    setSelectedImage(index);
  };

  return (
    <div className="relative w-full">
      {/* Main Image Display */}
      <div className="aspect-square bg-white border border-primary-200 overflow-hidden relative rounded-2xl">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={images[selectedImage]}
          alt={`${productName} - View ${selectedImage + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(index)}
              className={`flex-shrink-0 w-20 h-20 bg-white border rounded-xl transition-all overflow-hidden ${
                selectedImage === index
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-primary-200 hover:border-primary-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 1 && (
        <div className="flex items-center gap-3 mt-4 p-3 bg-white border border-primary-200 rounded-xl">
          <span className="text-xs text-primary-400 uppercase tracking-wider">Color</span>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-10 h-10 rounded-full transition-all border-2 ${
                  selectedColor === color
                    ? 'border-accent ring-2 ring-accent/30 scale-110'
                    : 'border-primary-200 hover:border-primary-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full text-xs text-primary-500 uppercase tracking-wider">
          {selectedImage + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
