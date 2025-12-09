import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Props:
 * - activeMainTab: string ('home'|'recommender'|'resources')
 * - setActiveMainTab: function
 */
export default function Header({ activeMainTab, setActiveMainTab, showChatBotTab }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "recommender", label: "Cloud Recommender" },
    ...(showChatBotTab ? [{ id: "chatbot", label: "Chatbot" }] : []),
    { id: "resources", label: "Contact Us" },
  ];

  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const navRef = useRef(null);
  const buttonsRef = useRef({});

  useEffect(() => {
    const activeButton = buttonsRef.current[activeMainTab];
    if (activeButton && navRef.current) {
      setUnderlineWidth(activeButton.offsetWidth);
      setUnderlineLeft(activeButton.offsetLeft);
    }
  }, [activeMainTab]);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center relative">
        {/* Logo on the left */}
        <div className="absolute left-6 text-2xl font-bold text-[#6E39CB] tracking-wide">CORA</div>

        {/* Menu in the center */}
        <nav className="flex relative" ref={navRef}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (buttonsRef.current[tab.id] = el)}
              onClick={() => setActiveMainTab(tab.id)}
              className={`relative px-10 py-1 text-base font-bold transition-colors duration-300 ${
                activeMainTab === tab.id ? 'text-[#6E39CB]' : 'text-gray-600 hover:text-[#6E39CB]'
              }`}
              aria-current={activeMainTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
          
          {/* Sliding underline */}
          <motion.div
            className="absolute h-1 bg-[#6E39CB] rounded-full"
            style={{
              bottom: "-17px",
            }}
            animate={{
              left: `${underlineLeft}px`,
              width: `${underlineWidth}px`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        </nav>
      </div>
    </header>
  );
}