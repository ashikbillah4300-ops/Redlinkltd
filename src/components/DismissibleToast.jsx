// ── DismissibleToast ────────────────────────────────────────────────────────
// Swipe-to-dismiss (with touch/hand), click-to-dismiss, and close button for react-hot-toast
import { useState, useRef } from 'react';
import { ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';

export default function DismissibleToast({ t }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const touchStartRef = useRef(null);
  const isDraggingRef = useRef(false);

  // ── Touch Handlers (Mobile Swipe to Dismiss) ──
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !touchStartRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartRef.current.x;
    const diffY = currentY - touchStartRef.current.y;

    // Only swipe horizontally if moving more horizontally than vertically
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const absDiff = Math.abs(dragOffset);

    if (absDiff > 40) {
      // Swiped far enough — slide off screen and dismiss
      setIsDismissing(true);
      setTimeout(() => {
        toast.dismiss(t.id);
      }, 140);
    } else {
      // Not dragged far enough — snap back
      setDragOffset(0);
    }
    touchStartRef.current = null;
  };

  // ── Click / Tap to dismiss ──
  const handleClick = (e) => {
    // Dismiss on single tap or click (if not actively swiping)
    if (Math.abs(dragOffset) < 10) {
      toast.dismiss(t.id);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        transform: isDismissing
          ? `translateX(${dragOffset >= 0 ? '125%' : '-125%'})`
          : `translateX(${dragOffset}px)`,
        opacity: isDismissing ? 0 : 1 - Math.min(Math.abs(dragOffset) / 180, 0.7),
        transition: isDraggingRef.current ? 'none' : 'transform 0.22s ease-out, opacity 0.22s ease-out',
        touchAction: 'pan-y',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      className="relative select-none"
      title="Click or swipe to dismiss"
    >
      <ToastBar toast={t} style={{ ...t.style, cursor: 'pointer' }}>
        {({ icon, message }) => (
          <div className="flex items-center gap-2.5 w-full pr-1 select-none">
            <span className="flex-shrink-0">{icon}</span>
            <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
              {message}
            </div>
            {t.type !== 'loading' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.dismiss(t.id);
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1.5 -mr-1 flex-shrink-0 cursor-pointer"
                aria-label="Close notification"
                title="Dismiss"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}
      </ToastBar>
    </div>
  );
}
