
import { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from "@/integrations/supabase/client";

interface CameraInputProps {
  onImageCapture: (imageData: string, recognizedItems?: any[]) => void;
  onClose: () => void;
}

const CameraInput = ({ onImageCapture, onClose }: CameraInputProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Initialize camera
  const initCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      setCameraPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraPermission(false);
      setError('Camera access denied. Please enable camera permissions.');
    }
  };

  useEffect(() => {
    initCamera();
    
    return () => {
      // Clean up by stopping all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
      }
    }
  };

  const processImage = async () => {
    if (capturedImage) {
      setIsProcessing(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Call the grocery recognition API
        const response = await supabase.functions.invoke('recognize_grocery', {
          body: { 
            image: capturedImage,
            userId: user?.id
          }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        onImageCapture(capturedImage, response.data.recognizedItems);
        
        toast({
          title: "Grocery recognition complete",
          description: `Recognized ${response.data.recognizedItems.length} items.`,
        });
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: "Error processing image",
          description: "Please try again.",
          variant: "destructive"
        });
        
        // Still pass the image along even if recognition failed
        onImageCapture(capturedImage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white bg-black/50 hover:bg-black/70 rounded-full" 
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md flex flex-col items-center">
        {error && (
          <div className="bg-destructive/20 text-destructive p-4 rounded-lg mb-4 text-center">
            {error}
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={triggerFileUpload}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload from gallery instead
            </Button>
          </div>
        )}
        
        {cameraPermission !== false && (
          <div className={cn(
            "rounded-xl overflow-hidden w-full aspect-[3/4] bg-black relative",
            capturedImage ? "border-4 border-sustainabite-purple" : ""
          )}>
            {!capturedImage ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover" 
              />
            )}
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-sustainabite-purple" />
                  <p className="text-white mt-4">Analyzing groceries...</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Hidden file input */}
        <input 
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        
        <div className="flex justify-center gap-4 mt-6">
          {!capturedImage ? (
            <>
              <Button 
                size="lg"
                className="rounded-full bg-white text-black hover:bg-white/90 p-4"
                onClick={captureImage}
              >
                <Camera className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full border-white text-white hover:bg-white/20 p-4"
                onClick={triggerFileUpload}
              >
                <Upload className="w-6 h-6" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full border-white text-white hover:bg-white/20 p-4"
                onClick={retakeImage}
                disabled={isProcessing}
              >
                <X className="w-6 h-6" />
              </Button>
              
              <Button 
                size="lg"
                className="rounded-full bg-sustainabite-purple hover:bg-sustainabite-purple/90 p-4"
                onClick={processImage}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Check className="w-6 h-6" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraInput;
