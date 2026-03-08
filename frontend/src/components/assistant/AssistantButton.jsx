import { useState } from "react";
import AssistantPanel from "./AssistantPanel";

export default function AssistantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-transparent text-white rounded-full w-20 h-20 shadow-none hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center text-2xl hover:rotate-12 border-none group animate-levitate"
        aria-label="Open Assistant"
      >
        <img 
          src="/placeholder-icon.png" 
          alt="Assistant" 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      {open && <AssistantPanel close={() => setOpen(false)} />}
    </>
  );
}
