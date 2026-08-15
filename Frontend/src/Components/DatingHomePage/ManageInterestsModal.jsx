import { useState } from "react";
import { X, HelpCircle } from "lucide-react";

export default function ManageInterestsModal({setmanageInterstModal}) {
  const [matchWithInterests, setMatchWithInterests] = useState(false);
  const [waitDuration, setWaitDuration] = useState("5 sec");
  const [interestInput, setInterestInput] = useState("");

  const durations = ["5 sec", "10 sec", "30 sec", "Forever"];

  return (
    <div className="  md:h-screen  flex items-center justify-center lg:p-4">
      <div className=" max-w-md sm:[50vh]  bg-[#1c1c24] rounded-md p-6 shadow-2xl">
        {/* Header */}
        <h2 className="text-white text-2xl font-bold mb-1">
          Manage Interests
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          Add and remove interests to help us find better matches for you.
        </p>

        {/* Match with interests toggle */}
        <div className="flex items-center justify-between bg-[#26262f] rounded-xl px-4 py-3 mb-4">
          <span className="text-white font-semibold">
            Match with interests
          </span>
          <button
            onClick={() => setMatchWithInterests((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              matchWithInterests ? "bg-purple-600" : "bg-[#3a3a44]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center transition-transform duration-200 ${
                matchWithInterests ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {!matchWithInterests && (
                <X size={12} className="text-[#1c1c24]" strokeWidth={3} />
              )}
            </span>
          </button>
        </div>

        {/* Add an interest input */}
        <div className="bg-[#26262f] rounded-xl px-4 py-3 mb-4">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            placeholder="Add an interest..."
            className="w-full bg-transparent text-gray-300 placeholder-gray-500 outline-none text-sm"
          />
        </div>

        {/* Max Wait Duration */}
        <div className="bg-[#26262f] rounded-xl px-4 py-4 mb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-white font-semibold text-sm">
              Max Wait Duration
            </span>
            <HelpCircle size={15} className="text-gray-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setWaitDuration(d)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  waitDuration === d
                    ? "bg-purple-600 text-white"
                    : "bg-[#3a3a44] text-gray-300 hover:bg-[#454550]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Done button */}
        <div className="flex justify-end">
          <button 
          onClick={()=>setmanageInterstModal(false)}
          className="bg-[#0d0d10] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-black transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}