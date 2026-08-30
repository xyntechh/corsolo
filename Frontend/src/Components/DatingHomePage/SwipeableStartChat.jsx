import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function SwipeableStartChat({ children, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const cardRef = useRef(null);
  const [maxOffset, setMaxOffset] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        setMaxOffset(cardRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const baseYRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const startDrag = (clientY) => {
    startYRef.current = clientY;
    baseYRef.current = isOpen ? 0 : maxOffset;
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  const moveDrag = (clientY) => {
    const delta = clientY - startYRef.current;

    if (Math.abs(delta) > 4) {
      hasDraggedRef.current = true;
    }

    let newY = baseYRef.current + delta;
    newY = Math.max(0, Math.min(maxOffset, newY));
    setDragY(newY);
  };

  const endDrag = () => {
    setIsDragging(false);

    if (!hasDraggedRef.current) {
      setIsOpen(true);
      setDragY(0);
      return;
    }

    const threshold = maxOffset * 0.25;
    if (dragY > threshold) {
      setIsOpen(false);
      setDragY(maxOffset);
    } else {
      setIsOpen(true);
      setDragY(0);
    }
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startDrag(e.clientY);
  };
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    moveDrag(e.clientY);
  };
  const handlePointerUp = () => endDrag();

  // Naya: window-level fallback listeners — agar mobile pe pointerup/cancel
  // element tak na pahunche (fast swipe, browser gesture conflict), tab bhi
  // drag properly khatam ho aur isDragging kabhi stuck na rahe.
  useEffect(() => {
    if (!isDragging) return;

    const onWindowMove = (e) => moveDrag(e.clientY);
    const onWindowUp = () => endDrag();

    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);

    return () => {
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("pointercancel", onWindowUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const closeCard = () => {
    setIsOpen(false);
    setDragY(maxOffset);
  };

  const translateY = isDragging ? dragY : isOpen ? 0 : maxOffset;

  // Naya: pill ki opacity ab card ki live position se aati hai —
  // isDragging flag se nahi. Isse touch karte hi button vanish nahi hota,
  // smooth fade hota hai jaisa card upar/niche jaata hai.
  const pillOpacity = maxOffset > 0 ? translateY / maxOffset : isOpen ? 0 : 1;
  const pillInteractive = pillOpacity > 0.5;

  return (
    <div className="relative w-full flex justify-center px-4 sm:px-7">
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={closeCard}
          aria-hidden="true"
        />
      )}

      {/* Collapsed "Start Chat" pill */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label="Swipe up to open"
        style={{ opacity: pillOpacity }}
        className={`absolute bottom-0 left-4 right-4 sm:left-7 sm:right-7 mx-auto max-w-xl rounded-t-[24px] bg-[#15151F] border border-white/10 px-5 py-3 flex items-center justify-center gap-2 touch-none select-none transition-opacity duration-150 z-20 ${
          pillInteractive ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <ChevronDown size={18} className="text-purple-400  rotate-180" />
        <span className="text-sm font-semibold text-white">Swipe up</span>
      </button>

      <div
        ref={cardRef}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        className="w-full max-w-xl relative z-20"
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full  rounded-t-[24px] bg-[#15151F] border border-white/10 border-b-0 px-5 py-3 flex items-center  justify-center gap-2 touch-none select-none cursor-grab active:cursor-grabbing"
        >
          <ChevronDown
            size={18}
            className={`text-purple-400 transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
          <span className="text-sm  font-semibold text-white">
            Swipe down 
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}