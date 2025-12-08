import { motion } from "framer-motion";
import { useStats } from "../hooks/useStats";
import { useIndustries } from "../hooks/useIndustries";
import { Loader2 } from "lucide-react";

export default function Home({ onIndustrySelect }) {
  // Menggunakan custom hook untuk mendapatkan data dari API
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const { industries, loading: industriesLoading, error: industriesError } = useIndustries();
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-6 py-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto text-center">
        
        {/* Cloud Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex justify-center"
        >
          {/* Simplified Cloud SVG for better performance */}
          <svg width="260" height="180" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
            <path d="M98 15C120 15 137 27 143 45C147 43 151 43 155 43C177 43 195 57 201 75C229 77 250 99 250 125C250 153 227 175 199 175H54C27 175 5 153 5 125C5 98 24 75 51 73C49 69 48 64 48 59C48 34 71 15 98 15Z" fill="#B3E5FC" fillOpacity="0.6"/>
            <path d="M98 15C120 15 137 27 143 45C147 43 151 43 155 43C177 43 195 57 201 75C229 77 250 99 250 125C250 153 227 175 199 175H54C27 175 5 153 5 125C5 98 24 75 51 73C49 69 48 64 48 59C48 34 71 15 98 15Z" stroke="#7DD3FC" strokeWidth="2" strokeOpacity="0.3"/>
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl lg:text-5xl font-bold text-[#6E39CB] mb-4 leading-tight"
        >
          Find Your Perfect Cloud Solution
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-gray-600 text-sm max-w-2xl mx-auto mb-12"
        >
          CORA will gladly recommends cloud instances and services<br />
          based on your specific needs and industry requirements
        </motion.p>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center gap-4 mb-10 flex-wrap"
        >
          <div className="bg-[#F5F0FE] rounded-2xl p-6 text-center min-w-44 border border-[#E9DAFC]">
            <div className="flex justify-center items-center mb-1">
              {statsLoading ? (
                <div className="w-12 h-8 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <h2 className="text-3xl font-bold text-[#6E39CB]">
                  {statsError ? '3' : stats.providers}
                </h2>
              )}
            </div>
            <p className="text-gray-700 text-xs font-medium">Cloud Service Providers</p>
          </div>

          <div className="bg-[#F5F0FE] rounded-2xl p-6 text-center min-w-44 border border-[#E9DAFC]">
            <div className="flex justify-center items-center mb-1">
              {statsLoading ? (
                <div className="w-10 h-8 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <h2 className="text-3xl font-bold text-[#6E39CB]">
                  {statsError ? '20' : stats.industries}
                </h2>
              )}
            </div>
            <p className="text-gray-700 text-xs font-medium">Industries Supported</p>
          </div>

          <div className="bg-[#F5F0FE] rounded-2xl p-6 text-center min-w-44 border border-[#E9DAFC]">
            <div className="flex justify-center items-center mb-1">
              {statsLoading ? (
                <div className="w-16 h-8 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <h2 className="text-3xl font-bold text-[#6E39CB]">
                  {statsError ? '1000+' : `${stats.services}+`}
                </h2>
              )}
            </div>
            <p className="text-gray-700 text-xs font-medium">Cloud Service Instances</p>
          </div>
        </motion.div>
        <p>&nbsp;</p>
        {/* What would you build Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">What solution do you need?</h3>
          <p className="text-gray-600 text-xs">A quick recommendation based on specific industry</p>
        </motion.div>

        {/* Button Grid - Industries from API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {industriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Skeleton loading for industries */}
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="py-3 px-4 bg-gray-200 rounded-xl animate-pulse h-12"
                />
              ))}
            </div>
          ) : industriesError ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm mb-4">Failed to load industries from API</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Fallback buttons */}
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#f3e8ff" }}
                  className="py-3 px-6 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all cursor-pointer"
                  onClick={() => {
                    if (onIndustrySelect) {
                      onIndustrySelect({ id: 1, name: "AI/ML", value: "AI_ML" });
                    }
                  }}
                >
                  AI/ML Workloads
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#f3e8ff" }}
                  className="py-3 px-6 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all cursor-pointer"
                  onClick={() => {
                    if (onIndustrySelect) {
                      onIndustrySelect({ id: 2, name: "E-commerce", value: "Ecommerce" });
                    }
                  }}
                >
                  Web Applications
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#f3e8ff" }}
                  className="py-3 px-6 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all cursor-pointer"
                  onClick={() => {
                    if (onIndustrySelect) {
                      onIndustrySelect({ id: 3, name: "BigData/Analytics", value: "BigData_Analytics" });
                    }
                  }}
                >
                  Data Analytics
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" style={{filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.04))"}}>
              {industries.map((industry, index) => (
                <motion.button
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: "#f3e8ff",
                    borderColor: "#d8b4fe",
                    transition: { type: "tween", duration: 0.1 }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { type: "tween", duration: 0.1 }
                  }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.01,
                    type: "tween"
                  }}
                  className="relative py-5 px-12 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 text-sm cursor-pointer transition-all duration-200 min-h-[70px] flex items-center justify-center text-center leading-tight"
                  onClick={() => {
                    console.log(`Selected industry: ${industry.name} (${industry.value})`);
                    if (onIndustrySelect) {
                      onIndustrySelect(industry);
                    }
                  }}
                >
                  {industry.name}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
