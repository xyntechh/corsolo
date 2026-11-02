import { useState, useEffect } from "react";
import { X, ImageOff, ShieldCheck, FileText } from "lucide-react";

const STORAGE_KEY = "image_sharing_notice_seen";

export default function ImportantNoticeModal() {
  const [open, setOpen] = useState(false);

  // Naye user ko (jisne abhi tak notice nahi dekha) home page par pehle dikhao
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-title"
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#1c1c24] rounded-md p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-1 pr-8">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0">
            <ImageOff size={20} className="text-purple-400" />
          </div>
          <h2 id="notice-title" className="text-white text-2xl font-bold">
            Important Notice
          </h2>
        </div>
        <p className="text-gray-400 text-sm mb-5 mt-2">
          Image sharing is temporarily unavailable.
        </p>

        {/* Main message */}
        <div className="bg-[#26262f] rounded-xl px-4 py-4 mb-4">
          <p className="text-white font-semibold text-sm mb-2">
            Why we closed it
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            We have temporarily closed our image sharing feature because too
            many unwanted and nude images were being shared on our platform
            continuously.
          </p>
        </div>

        <div className="bg-[#26262f] rounded-xl px-4 py-4 mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            We respect our community and are working continuously to make this
            a safe space for everyone. The feature will return once stronger
            protections are in place.
          </p>
        </div>

        {/* Privacy & Policy */}
        <div className="bg-[#26262f] rounded-xl px-4 py-4 mb-6">
          <p className="text-white font-semibold text-sm mb-3">
            Learn more
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/privacy"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#3a3a44] text-gray-300 hover:bg-[#454550] transition-colors"
            >
              <ShieldCheck size={15} />
              Privacy
            </a>
            <a
              href="/policy"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#3a3a44] text-gray-300 hover:bg-[#454550] transition-colors"
            >
              <FileText size={15} />
              Our Policy
            </a>
          </div>
        </div>

        {/* I understand button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}

/*
  USAGE (Home page me):

  import ImportantNoticeModal from "./ImportantNoticeModal";

  export default function Home() {
    return (
      <>
        <ImportantNoticeModal />
        ... baaki home page ...
      </>
    );
  }
*/