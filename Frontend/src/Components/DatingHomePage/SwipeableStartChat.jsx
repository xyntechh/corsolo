import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Behavior:
 * - Card + its top handle move TOGETHER as one unit while dragging.
 * - Drag down past threshold -> the whole thing (handle included) slides
 *   fully out of view (down).
 * - Once closed, a separate small "Start Chat" pill sits pinned at the
 *   very bottom (bottom: 0). Dragging THAT pill up brings the entire card
 *   (handle + content) back up together.
 */
export default function SwipeableStartChat({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const cardRef = useRef(null);
  const [maxOffset, setMaxOffset] = useState(0);

  // Card (handle + content) ki total height measure karo —
  // isi se pata chalega ki neeche jaakar kitna translate karna hai
  // taaki pura card viewport ke bahar chala jaye.
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

  // ---- Drag-to-toggle ----
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const baseYRef = useRef(0);

  const startDrag = (clientY) => {
    startYRef.current = clientY;
    // agar khula hai toh 0 se shuru, band hai toh maxOffset se shuru
    baseYRef.current = isOpen ? 0 : maxOffset;
    setIsDragging(true);
  };

  const moveDrag = (clientY) => {
    const delta = clientY - startYRef.current;
    let newY = baseYRef.current + delta;
    // 0 (khula) se maxOffset (band) ke beech hi rakho
    newY = Math.max(0, Math.min(maxOffset, newY));
    setDragY(newY);
  };

  const endDrag = () => {
    setIsDragging(false);
    const threshold = maxOffset * 0.25; // 25% se zyada khincha toh state switch karo

    if (dragY > threshold) {
      setIsOpen(false);
      setDragY(maxOffset);
    } else {
      setIsOpen(true);
      setDragY(0);
    }
  };

  // Pointer events = mouse (desktop) + touch (mobile) dono ek hi jagah se handle
  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startDrag(e.clientY);
  };
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    moveDrag(e.clientY);
  };
  const handlePointerUp = () => endDrag();

  // Live drag ke time dragY follow karo, warna state ke hisaab se snap position
  const translateY = isDragging ? dragY : isOpen ? 0 : maxOffset;

  return (
    <div className="relative w-full flex justify-center px-4 sm:px-7">
      {/* Collapsed "Start Chat" pill — bottom: 0 pe pinned.
          Sirf tab dikhta/draggable hota hai jab card band ho. */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label="Swipe up to open"
        className={`absolute bottom-0 left-4 right-4 sm:left-7 sm:right-7 mx-auto max-w-xl rounded-t-[24px] bg-[#15151F] border border-white/10 px-5 py-3 flex items-center justify-center gap-2 touch-none select-none transition-opacity duration-200 ${
          !isOpen && !isDragging
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronDown size={18} className="text-purple-400  rotate-180" />
        <span className="text-sm font-semibold text-white">Start Chat</span>
      </button>

      {/* Full card — handle + content move together as ONE unit */}
      <div
        ref={cardRef}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        className="w-full max-w-xl"
      >
        {/* Handle — ab ye bhi card ke saath hi slide hota hai, pinned nahi hai */}
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
            Down Chat
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}