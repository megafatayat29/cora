import { useState } from "react";

import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

import Home from "./pages/Home";
import Recommender from "./pages/Recommender";
import Resources from "./pages/Resources";

import Chatbot from "./components/Chatbot";

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState("home");
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showChatbotTab, setShowChatbotTab] = useState(false);

  // Function to handle industry selection from Home page
  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setActiveMainTab("recommender");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} showChatBotTab={showChatbotTab} />
      {/* Hidden toggle button for Chatbot tab */}
      <button
        onClick={() => setShowChatbotTab(prev => !prev)}
        className="fixed top-2 left-2 w-2 h-2 opacity-20 hover:opacity-60 transition rounded-full bg-gray-300"
        title="Toggle Chatbot Tab"
      ></button>

      <main className="flex-1">
        {activeMainTab === "home" && <Home onIndustrySelect={handleIndustrySelect} />}
        {activeMainTab === "recommender" && <Recommender selectedIndustry={selectedIndustry} />}
        {activeMainTab === "resources" && <Resources />}
        {activeMainTab === "chatbot" && (
          <div className="p-10">  
            <Chatbot />
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
}