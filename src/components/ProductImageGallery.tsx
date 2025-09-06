import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-lg bg-gray-100 group">
          <img 
            src={images[selectedImage]} 
            alt={`${productName} - Image ${selectedImage + 1}`}
            className="w-full h-96 object-cover cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Zoom Icon */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
            onClick={() => setIsZoomOpen(true)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-md border-2 transition-all flex-shrink-0 hover:scale-105 ${
                  selectedImage === index 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <img 
              src={images[selectedImage]} 
              alt={`${productName} - Zoomed view`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={() => setIsZoomOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation in Zoom */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter in Zoom */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};