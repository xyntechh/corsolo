import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Eye, Check, ImageIcon } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ViewOnceSnap({ id, isMe }) {
  const token = localStorage.getItem("authToken");
  const [state, setState] = useState("loading"); // loading | ready | sent | opened | error
  const [src, setSrc] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const srcRef = useRef(null);

  // Bubble ka status laao
  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/api/snaps/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (cancelled) return;
        if (!data.exists || data.viewed) return setState("opened");
        setState(data.isSender ? "sent" : "ready");
      })
      .catch(() => !cancelled && setState("error"));
    return () => { cancelled = true; };
  }, [id]);

  const close = () => {
    if (srcRef.current) URL.revokeObjectURL(srcRef.current);
    srcRef.current = null;
    setSrc(null);
    setState("opened");
  };

  const open = async () => {
    try {
      const res = await axios.get(`${API}/api/snaps/${id}/view`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      srcRef.current = url;
      setSecondsLeft(10);
      setSrc(url);
    } catch (e) {
      setState("opened"); // 410 = pehle hi khul chuka
    }
  };

  // 10 sec countdown, phir auto close
  useEffect(() => {
    if (!src) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(t); close(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [src]);

  // Component hatne par memory saaf
  useEffect(() => () => srcRef.current && URL.revokeObjectURL(srcRef.current), []);

  if (state === "loading")
    return <div className="mt-1 h-10 w-40 rounded-lg bg-white/5 animate-pulse" />;

  if (state === "error")
    return <div className="mt-1 text-xs text-neutral-500">Snap load nahi hua</div>;

  if (state === "opened")
    return (
      <div className="mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-xs text-neutral-500">
        <Eye size={14} /> Opened
      </div>
    );

  if (state === "sent")
    return (
      <div className="mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
        <Check size={14} /> Snap sent
      </div>
    );

  return (
    <>
      <button
        onClick={open}
        className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-sm font-semibold text-white transition"
      >
        <ImageIcon size={16} /> Tap to view
      </button>

      {src && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <span className="text-white text-sm font-semibold tabular-nums">{secondsLeft}s</span>
            <button onClick={close} className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm">
              Close
            </button>
          </div>
          <img
            src={src}
            alt=""
            draggable={false}
            className="max-w-full max-h-[85vh] rounded-lg pointer-events-none"
          />
          <p className="text-neutral-400 text-xs mt-3">Once you close this snap, it will be permanently deleted and cannot be viewed again.</p>
        </div>
      )}
    </>
  );
}