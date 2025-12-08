import { useState } from "react";

import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

import Home from "./pages/Home";
import Recommender from "./pages/Recommender";
import Resources from "./pages/Resources";

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState("home");
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  // Function to handle industry selection from Home page
  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setActiveMainTab("recommender");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} />

      <main className="flex-1">
        {activeMainTab === "home" && <Home onIndustrySelect={handleIndustrySelect} />}
        {activeMainTab === "recommender" && <Recommender selectedIndustry={selectedIndustry} />}
        {activeMainTab === "resources" && <Resources />}
      </main>

      <Footer />
    </div>
  );
}
