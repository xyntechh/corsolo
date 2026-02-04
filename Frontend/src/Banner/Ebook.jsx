import { useNavigate } from "react-router-dom";

export default function Ebook() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/eBook");
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 py-2 px-4 shadow-lg border-b border-purple-600">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-red-500 rounded-full p-1 animate-pulse">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-xs sm:text-sm">
            Catch Her Cheating First
          </h2>
        </div>

        <button 
        onClick={handleNavigate}
        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-1 px-3 sm:px-4 rounded-full text-xs transition-all duration-300 hover:scale-105 shadow-md whitespace-nowrap">
          Tap Here →
        </button>
      </div>
    </div>
  );
}
