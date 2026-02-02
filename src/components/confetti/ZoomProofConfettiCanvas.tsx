import React from 'react';
import confetti from 'canvas-confetti';

type ConfettiInstance = ReturnType<typeof confetti.create>;

interface ZoomProofConfettiCanvasProps {
  zIndex?: number;
  onInstanceReady?: (instance: ConfettiInstance) => void;
}

/**
 * A confetti canvas that maintains consistent visual size regardless of browser zoom level.
 * 
 * How it works:
 * - Stores the initial devicePixelRatio when component mounts
 * - Detects zoom changes by comparing current DPR with initial
 * - Applies inverse scale transform to compensate for zoom
 * - Expands canvas size proportionally so it still covers full viewport
 */
export const ZoomProofConfettiCanvas: React.FC<ZoomProofConfettiCanvasProps> = ({
  zIndex = 9999,
  onInstanceReady,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const instanceRef = React.useRef<ConfettiInstance | null>(null);
  const initialDprRef = React.useRef<number>(window.devicePixelRatio || 1);
  const [zoomCompensation, setZoomCompensation] = React.useState(1);

  // Detect browser zoom level by comparing current DPR with initial
  const detectZoomLevel = React.useCallback(() => {
    const currentDpr = window.devicePixelRatio || 1;
    const initialDpr = initialDprRef.current;
    
    // Calculate zoom factor: if user zooms to 150%, DPR increases by 1.5x
    const zoomFactor = currentDpr / initialDpr;
    
    // Return inverse to compensate: 1/1.5 = 0.667
    return 1 / zoomFactor;
  }, []);

  // Update zoom compensation on resize/zoom
  React.useEffect(() => {
    const updateZoom = () => {
      const compensation = detectZoomLevel();
      setZoomCompensation(compensation);
    };

    // Initial detection
    updateZoom();

    // Listen for resize which fires on zoom
    window.addEventListener('resize', updateZoom);
    
    // Also check periodically for zoom changes that don't trigger resize
    const interval = setInterval(updateZoom, 500);

    return () => {
      window.removeEventListener('resize', updateZoom);
      clearInterval(interval);
    };
  }, [detectZoomLevel]);

  // Initialize confetti instance
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Avoid recreating if instance already exists
    if (instanceRef.current) return;

    instanceRef.current = confetti.create(canvas, {
      resize: true,
      useWorker: false,
    });

    if (onInstanceReady) {
      onInstanceReady(instanceRef.current);
    }

    return () => {
      // Clean up instance before canvas unmounts
      if (instanceRef.current) {
        instanceRef.current.reset();
        instanceRef.current = null;
      }
    };
  }, [onInstanceReady]);

  // Calculate canvas dimensions to fill viewport regardless of zoom
  // GPU acceleration hints for smoother animation
  const canvasStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    // Use scale transform to compensate for browser zoom
    // When zoomed in (e.g., 150%), we scale down to 66.7% (1/1.5)
    // and increase size proportionally
    width: `${100 / zoomCompensation}vw`,
    height: `${100 / zoomCompensation}vh`,
    // Combine transforms - translateZ(0) forces GPU layer creation
    transform: `scale(${zoomCompensation}) translateZ(0)`,
    transformOrigin: 'top left',
    zIndex,
    pointerEvents: 'none',
    // GPU acceleration properties
    willChange: 'transform, contents',
    backfaceVisibility: 'hidden',
    // Force hardware acceleration
    WebkitBackfaceVisibility: 'hidden',
  } as React.CSSProperties;

  return <canvas ref={canvasRef} style={canvasStyle} />;
};

export default ZoomProofConfettiCanvas;
