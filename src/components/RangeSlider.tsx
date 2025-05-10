import React, { useState, useEffect, useRef, useCallback } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  startValue: number;
  endValue: number;
  step: number;
  disabled?: boolean;
  formatValue: (value: number) => string;
  onChange: (start: number, end: number) => void;
}

export default function RangeSlider({
  min,
  max,
  startValue,
  endValue,
  step,
  disabled = false,
  formatValue,
  onChange,
}: RangeSliderProps) {
  const [start, setStart] = useState(startValue);
  const [end, setEnd] = useState(endValue);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  // State to track if the next click should set the start or end
  const [nextClickSetsStart, setNextClickSetsStart] = useState(true);
  const [wasDragging, setWasDragging] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const startHandleRef = useRef<HTMLDivElement>(null);
  const endHandleRef = useRef<HTMLDivElement>(null);

  // Update internal state when props change
  useEffect(() => {
    setStart(startValue);
    setEnd(endValue);
  }, [startValue, endValue]);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!railRef.current) return min;

      const railRect = railRef.current.getBoundingClientRect();
      const railWidth = railRect.width;
      const railLeft = railRect.left;

      // Calculate the percentage of the position within the rail
      const percentage = Math.max(0, Math.min(100, ((clientX - railLeft) / railWidth) * 100));

      // Convert percentage to actual value
      const rawValue = min + (percentage / 100) * (max - min);

      // Round to nearest step
      return Math.round(rawValue / step) * step;
    },
    [min, max, step]
  );

  const handlePositionChange = useCallback(
    (clientX: number) => {
      if (disabled) return;

      const newValue = getValueFromPosition(clientX);

      if (isDraggingStart) {
        // Ensure start doesn't exceed end - step
        const cappedValue = Math.min(end - step, newValue);
        setStart(Math.max(min, cappedValue));
        onChange(Math.max(min, cappedValue), end);
      } else if (isDraggingEnd) {
        // Ensure end doesn't go below start + step
        const cappedValue = Math.max(start + step, newValue);
        setEnd(Math.min(max, cappedValue));
        onChange(start, Math.min(max, cappedValue));
      }
    },
    [
      disabled,
      getValueFromPosition,
      isDraggingStart,
      isDraggingEnd,
      start,
      end,
      min,
      max,
      step,
      onChange,
    ]
  );

  const handleSliderClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      // Prevent handling if we're already dragging a handle
      if (isDraggingStart || isDraggingEnd) return;

      // If we were previously dragging, don't change the next click behavior
      if (wasDragging) {
        setWasDragging(false);
        return;
      }

      const value = getValueFromPosition(e.clientX);

      // New logic: toggle between setting start and end
      if (nextClickSetsStart) {
        // Ensure start doesn't exceed end minus one step
        const newStart = Math.min(end - step, value);
        setStart(Math.max(min, newStart));
        onChange(Math.max(min, newStart), end);
        setNextClickSetsStart(false);
      } else {
        // Ensure end doesn't go below start plus one step
        const newEnd = Math.max(start + step, value);
        setEnd(Math.min(max, newEnd));
        onChange(start, Math.min(max, newEnd));
        setNextClickSetsStart(true);
      }
    },
    [
      disabled,
      getValueFromPosition,
      isDraggingStart,
      isDraggingEnd,
      start,
      end,
      min,
      max,
      step,
      onChange,
      nextClickSetsStart,
      wasDragging,
    ]
  );

  // Mouse event handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingStart || isDraggingEnd) {
        e.preventDefault();
        handlePositionChange(e.clientX);
      }
    },
    [isDraggingStart, isDraggingEnd, handlePositionChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingStart || isDraggingEnd) {
      setWasDragging(true);
    }
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  }, [isDraggingStart, isDraggingEnd]);

  useEffect(() => {
    if (isDraggingStart || isDraggingEnd) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingStart, isDraggingEnd, handleMouseMove, handleMouseUp]);

  // Touch event handlers
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDraggingStart || isDraggingEnd) {
        handlePositionChange(e.touches[0].clientX);
      }
    },
    [isDraggingStart, isDraggingEnd, handlePositionChange]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDraggingStart || isDraggingEnd) {
      setWasDragging(true);
    }
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  }, [isDraggingStart, isDraggingEnd]);

  useEffect(() => {
    if ((isDraggingStart || isDraggingEnd) && isTouchDevice) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDraggingStart, isDraggingEnd, isTouchDevice, handleTouchMove, handleTouchEnd]);

  // Handle keyboard controls for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, isStart: boolean) => {
      if (disabled) return;

      let newValue: number;
      const currentValue = isStart ? start : end;
      const minValue = isStart ? min : start + step;
      const maxValue = isStart ? end - step : max;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(maxValue, currentValue + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(minValue, currentValue - step);
          break;
        case 'Home':
          newValue = minValue;
          break;
        case 'End':
          newValue = maxValue;
          break;
        default:
          return;
      }

      e.preventDefault();

      if (isStart) {
        setStart(newValue);
        onChange(newValue, end);
      } else {
        setEnd(newValue);
        onChange(start, newValue);
      }
    },
    [disabled, start, end, min, max, step, onChange]
  );

  // Calculate positions for UI elements
  const range = max - min;
  const startPercent = ((start - min) / range) * 100;
  const endPercent = ((end - min) / range) * 100;
  const selectionWidth = endPercent - startPercent;

  // Calculate the selected duration
  const selectedDuration = end - start;

  return (
    <div className="space-y-3">
      <div
        ref={railRef}
        className={`relative h-2 rounded-full bg-gray-200 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSliderClick}
      >
        {/* Selected range track */}
        <div
          className="absolute h-full bg-indigo-500 rounded-full"
          style={{ left: `${startPercent}%`, width: `${selectionWidth}%` }}
        />

        {/* Start handle */}
        <div
          ref={startHandleRef}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={end - step}
          aria-valuenow={start}
          aria-valuetext={formatValue(start)}
          aria-label="Start time"
          tabIndex={disabled ? -1 : 0}
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isDraggingStart ? 'cursor-grabbing' : ''} ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{ left: `${startPercent}%` }}
          onMouseDown={(e) => {
            if (!disabled) {
              e.stopPropagation();
              setIsDraggingStart(true);
            }
          }}
          onTouchStart={(e) => {
            if (!disabled) {
              e.stopPropagation();
              setIsDraggingStart(true);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, true)}
        />

        {/* End handle */}
        <div
          ref={endHandleRef}
          role="slider"
          aria-valuemin={start + step}
          aria-valuemax={max}
          aria-valuenow={end}
          aria-valuetext={formatValue(end)}
          aria-label="End time"
          tabIndex={disabled ? -1 : 0}
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isDraggingEnd ? 'cursor-grabbing' : ''} ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{ left: `${endPercent}%` }}
          onMouseDown={(e) => {
            if (!disabled) {
              e.stopPropagation();
              setIsDraggingEnd(true);
            }
          }}
          onTouchStart={(e) => {
            if (!disabled) {
              e.stopPropagation();
              setIsDraggingEnd(true);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-gray-600">
        <div>{formatValue(start)}</div>
        <div className="font-medium text-indigo-600">Duração: {formatValue(selectedDuration)}</div>
        <div>{formatValue(end)}</div>
      </div>
    </div>
  );
}
