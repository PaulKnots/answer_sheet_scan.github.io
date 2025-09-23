
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
  onBack: () => void;
  error: string | null;
}

const CameraIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z" />
      <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
);

const BackIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="m11.828 12 4.95 4.95-1.414 1.414L9 12l6.364-6.364 1.414 1.414z" />
    </svg>
);


const CameraView: React.FC<CameraViewProps> = ({ onCapture, onBack, error }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Could not access camera. Please ensure permissions are granted and try again.");
      }
    };
    
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCaptureClick = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-slate-700">Scan Answer Sheet</h2>
      <p className="text-slate-500 mb-6 text-center">
        Position the sheet within the frame and capture a clear, well-lit image.
      </p>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 w-full rounded-r-lg" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="w-full max-w-2xl aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg relative border-4 border-slate-200">
        {cameraError ? (
          <div className="w-full h-full flex items-center justify-center p-4 text-center text-white">
            <p>{cameraError}</p>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <div className="absolute inset-0 border-8 border-white/30 rounded-xl pointer-events-none"></div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      <div className="mt-8 flex items-center justify-center w-full gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl shadow-md hover:bg-slate-300 transition-all duration-200 flex items-center gap-2"
        >
          <BackIcon className="w-5 h-5"/>
          Edit Key
        </button>
        <button
          onClick={handleCaptureClick}
          disabled={!!cameraError}
          className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
        >
          <CameraIcon className="w-7 h-7" />
          Capture & Grade
        </button>
      </div>
    </div>
  );
};

export default CameraView;
