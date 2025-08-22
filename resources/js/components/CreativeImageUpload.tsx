import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Image as ImageIcon,
  X,
  Trash2
} from 'lucide-react';

interface CreativeImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  title?: string;
  description?: string;
  maxImages?: number;
}

export default function CreativeImageUpload({
  images,
  onImagesChange,
  title = "Product Images",
  description = "Upload images for your product",
  maxImages = 10
}: CreativeImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback((newImages: string[]) => {
    const currentImages = [...images];
    newImages.forEach(image => {
      if (!currentImages.includes(image) && currentImages.length < maxImages) {
        currentImages.push(image);
      }
    });
    onImagesChange(currentImages);
  }, [images, onImagesChange, maxImages]);

  const processFiles = useCallback((files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, GIF, WebP)');
      setIsUploading(false);
      return;
    }

    const newImages: string[] = [];
    let processedCount = 0;
    const totalFiles = validFiles.length;

    validFiles.forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && result.startsWith('data:image/')) {
          console.log('Image processed successfully:', file.name, 'Size:', result.length);
          newImages.push(result);
        } else {
          console.error('Invalid image data for file:', file.name);
        }
        
        processedCount++;
        
        // When all files are processed, add them to the images array
        if (processedCount === totalFiles) {
          console.log('All files processed. Adding', newImages.length, 'images');
          addImages(newImages);
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file:', file.name);
        processedCount++;
        
        if (processedCount === totalFiles) {
          setIsUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    });
  }, [addImages]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
      // Reset the input value so the same file can be selected again
      event.target.value = '';
    }
  }, [processFiles]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback((imageUrl: string) => {
    onImagesChange(images.filter(img => img !== imageUrl));
  }, [images, onImagesChange]);

  const clearAllImages = useCallback(() => {
    onImagesChange([]);
  }, [onImagesChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Single Upload Area */}
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {/* Unified Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isUploading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-2">
            {isUploading ? 'Processing images...' : 'Click to upload images or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">
            Supports: JPG, PNG, GIF, WebP (Max: {maxImages} images)
          </p>
        </div>
      </div>

      {/* Image Count & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {images.length} / {maxImages} images
          </Badge>
          {images.length > 0 && (
            <Badge variant="outline" className="text-green-600">
              Ready
            </Badge>
          )}
          {images.length > 0 && (
            <Badge variant="outline" className="text-blue-600">
              First image = Main
            </Badge>
          )}
        </div>
        {images.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearAllImages}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Debug Info (remove this after testing) */}
      {images.length > 0 && (
        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
          Debug: {images.length} images loaded. First image type: {images[0]?.substring(5, 25)}...
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="group relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover bg-gray-100"
                    onLoad={() => {
                      console.log('Image loaded successfully for index:', index);
                    }}
                    onError={(e) => {
                      console.error('Image failed to load at index:', index, 'Data preview:', image.substring(0, 100));
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEN0Q5RUIiLz4KPHBhdGggZD0iTTQwIDQwSDEwVjYwSDEwVjQwSDBWNDBIMFY2MEgxMFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                    }}
                  />
                  
                  {/* Main Image Indicator */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-blue-600 text-white text-xs">
                        Main
                      </Badge>
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-600 truncate">
                    {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-600 mb-4">
            Upload images to showcase your product
          </p>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
      )}
    </div>
  );
}
