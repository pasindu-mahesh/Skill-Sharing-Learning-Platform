import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ImageUploader = ({ currentImage, onChange, className = "" }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const objectUrlRef = useRef(null);

  // Sync preview with external currentImage changes
  useEffect(() => {
    setPreviewUrl(currentImage);
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large. Please choose an image under 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create temporary preview
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const tempUrl = URL.createObjectURL(file);
      objectUrlRef.current = tempUrl;
      setPreviewUrl(tempUrl);

      // Pass file to parent component for upload
      await onChange(file);

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setPreviewUrl(currentImage); // Revert to original image
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="rounded-full overflow-hidden bg-secondary aspect-square">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
      </div>
      
      <input
        id="profile-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      <label
        htmlFor="profile-image"
        className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 text-white p-2 cursor-pointer shadow-md"
        aria-label="Change profile picture"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
          </svg>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
