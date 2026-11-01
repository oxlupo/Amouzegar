import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RefreshCw, 
  Check, 
  X, 
  Move,
  Crop as CropIcon
} from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load natural dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
    setRotation(0);
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setPan({ x: 0, y: 0 });
  };

  // Reset adjustments
  const handleReset = () => {
    setZoom(1.0);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Mouse / Touch drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Execute Crop on offscreen 1000x1000 canvas (1:1 aspect ratio)
  const handleConfirmCrop = () => {
    if (!imageRef.current || !containerRef.current) return;
    const img = imageRef.current;
    const container = containerRef.current;
    const cropBoxSize = container.clientWidth; // e.g. 360

    const targetOutputSize = 1000; // 1000x1000 high quality 1:1 scale
    const scaleRatio = targetOutputSize / cropBoxSize;

    const canvas = document.createElement('canvas');
    canvas.width = targetOutputSize;
    canvas.height = targetOutputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background for luxury jewelry presentation
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetOutputSize, targetOutputSize);

    // Apply smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    // Move to canvas center
    ctx.translate(targetOutputSize / 2, targetOutputSize / 2);

    // Rotate
    ctx.rotate((rotation * Math.PI) / 180);

    // Pan (adjusted for scale and rotation)
    ctx.translate(pan.x * scaleRatio, pan.y * scaleRatio);

    // Determine base scale to cover crop box
    const isSideways = rotation === 90 || rotation === 270;
    const imgW = isSideways ? naturalSize.height : naturalSize.width;
    const imgH = isSideways ? naturalSize.width : naturalSize.height;

    // Compute display dimensions
    const baseFitScale = Math.max(cropBoxSize / imgW, cropBoxSize / imgH);
    const finalDrawW = naturalSize.width * baseFitScale * zoom * scaleRatio;
    const finalDrawH = naturalSize.height * baseFitScale * zoom * scaleRatio;

    ctx.drawImage(
      img,
      -finalDrawW / 2,
      -finalDrawH / 2,
      finalDrawW,
      finalDrawH
    );
    ctx.restore();

    try {
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onCropComplete(croppedDataUrl);
    } catch {
      // Fallback
      onCropComplete(imageSrc);
    }
  };

  // Calculate container visual style
  const isSideways = rotation === 90 || rotation === 270;
  const effectiveW = isSideways ? naturalSize.height : naturalSize.width;
  const effectiveH = isSideways ? naturalSize.width : naturalSize.height;
  const baseScale = effectiveW && effectiveH ? Math.max(340 / effectiveW, 340 / effectiveH) : 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-peyda select-none animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-stone-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CropIcon className="w-4 h-4 text-stone-300 stroke-[1.75]" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              تنظیم کادر و کراپ تصویر اثر
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="انصراف و بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-5 py-2.5 bg-stone-900/60 border-b border-stone-800/60 text-[11px] text-stone-400 flex items-center justify-between">
          <span>مقیاس: ۱:۱ (مربع استاندارد کاتالوگ و کارت‌های وب‌سایت)</span>
          <span className="font-mono text-stone-500">1:1 ASPECT RATIO</span>
        </div>

        {/* Crop Area */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-black">
          
          {/* Square Viewport */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-xl overflow-hidden border-2 border-stone-600 bg-white shadow-inner flex items-center justify-center select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* The Image */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="در حال کراپ"
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
              draggable={false}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                maxWidth: 'none',
                width: imageLoaded && effectiveW ? `${naturalSize.width * baseScale}px` : 'auto',
                height: imageLoaded && effectiveH ? `${naturalSize.height * baseScale}px` : 'auto',
              }}
              className="pointer-events-none filter drop-shadow-sm"
            />

            {/* Rule of Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-stone-900/15" />
              <div className="border-r border-b border-stone-900/15" />
              <div className="border-b border-stone-900/15" />
              <div className="border-r border-b border-stone-900/15" />
              <div className="border-r border-b border-stone-900/15" />
              <div className="border-b border-stone-900/15" />
              <div className="border-r border-stone-900/15" />
              <div className="border-r border-stone-900/15" />
              <div />
            </div>

            {/* Corner Indicators */}
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-stone-800 pointer-events-none" />
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-stone-800 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-stone-800 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-stone-800 pointer-events-none" />

            {/* Floating drag helper hint */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[10px] text-white flex items-center gap-1.5 pointer-events-none font-light">
              <Move className="w-3 h-3 text-stone-300 stroke-[1.5]" />
              <span>برای جابجایی تصویر را بکشید</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="w-full max-w-[340px] mt-5 space-y-4">
            
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-stone-400" />
                  <span>بزرگ‌نمایی</span>
                </span>
                <span className="font-mono text-[11px] text-stone-400">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}
                  className="p-1.5 rounded-lg border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="کاهش زوم"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                  className="p-1.5 rounded-lg border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="افزایش زوم"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions: Rotate & Reset */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-900">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-stone-400" />
                <span>چرخش ۹۰ درجه ({rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                <span>بازنشانی</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-stone-800 flex items-center justify-end gap-3 bg-stone-950">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-stone-200 text-black text-xs font-bold transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow"
          >
            <Check className="w-4 h-4 stroke-[2]" />
            <span>تأیید و ذخیره برش (1:1)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
