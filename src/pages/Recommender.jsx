import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Zap, Loader2, X, Network } from "lucide-react";
import { useIndustries } from "../hooks/useIndustries";
import { useScales } from "../hooks/useScales";
import { usePurposes, useProviders, useCategories } from "../hooks/useFormData";
import { useRecommendations } from "../hooks/useRecommendations";
import { useSearch } from "../hooks/useSearch";
import { TagInput } from "../components/TagInput";
import KnowledgeGraph from "../components/KnowledgeGraph";
import RecommendationResultTabs from "../components/RecommendationResultTabs";

export default function Recommender({ selectedIndustry }) {
  const [activeTab, setActiveTab] = useState("recommender"); // Start with recommender tab
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showNLTab, setShowNLTab] = useState(false);
  
  const [nlText, setNlText] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlResponse, setNlResponse] = useState(null);

  // Search hook
  const { searchResults, loading: searchLoading, error: searchError, searchServices } = useSearch();
  
  // Pagination and detail states
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = searchResults.slice(startIndex, endIndex);
  
  // Handle card expansion
  const toggleCardDetail = (cardId) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(cardId)) {
      newExpandedCards.delete(cardId);
    } else {
      newExpandedCards.add(cardId);
    }
    setExpandedCards(newExpandedCards);
  };
  
  // Form state
  const [formData, setFormData] = useState({
    industry: "",
    scale: "",
    purposes: [],
    category: "",
    region: "Jakarta",
    providers: [],
    priceLimit: "",
    orderBy: "Price (Low to High)",
    recommendations: 100,
  });

  const [nlFormData, setNlFormData] = useState({
    industry: "",
    scale: "",
    purposes: [],
    category: "Compute",
    region: "",
    providers: [],
    orderBy: "AI Match",
  });
  
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Search handler
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchServices(searchQuery);
      setShowResults(results.length > 0);
      setCurrentPage(1); // Reset to first page
      setExpandedCards(new Set()); // Collapse all cards
    } else {
      setShowResults(false);
    }
  };

  // Auto re-query function
  const handleFormChange = async (newFormData) => {
    setFormData(newFormData);
    
    // If recommendations are already shown and we have required field, re-query with new data
    if (showRecommendations && newFormData.industry && !recommendationsLoading) {
      try {
        console.log('🔄 Auto re-querying with updated form data:', newFormData);
        await getRecommendations(newFormData);
      } catch (error) {
        console.error('❌ Failed to get recommendations with updated form:', error);
      }
    }
  };

  const handleInferRecommend = async () => {
    if (!nlText.trim()) {
      alert("Please enter text.");
      return;
    }

    try {
      setNlLoading(true);
      setNlResponse(null);

      const response = await fetch("/api/infer_and_recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nlText }),
      });

      const data = await response.json();
      setNlResponse(data);
      setNlFormData({
        industry: data.entities?.industry || "",
        region: data.entities?.region || "",
        providers: data.entities?.providers || [],
        purposes: data.entities?.purposes || [],
        scale: data.entities?.scale || "",
        category: "Compute",
        orderBy: "AI Match",
      });

    } catch (err) {
      console.error("AI Recommender Error:", err);
      alert("Something went wrong.");
    } finally {
      setNlLoading(false);
    }
  };

  // API hooks - Load immediately on component mount
  const { industries, loading: industriesLoading, error: industriesError } = useIndustries();
  const { scales, loading: scalesLoading, error: scalesError } = useScales();
  const { purposes, loading: purposesLoading, error: purposesError } = usePurposes();
  const { providers, loading: providersLoading, error: providersError } = useProviders();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { recommendations, loading: recommendationsLoading, error: recommendationsError, getRecommendations } = useRecommendations();

  // Update formData when selectedIndustry changes
  useEffect(() => {
    if (selectedIndustry) {
      setFormData(prev => ({
        ...prev,
        industry: selectedIndustry.value
      }));
    }
  }, [selectedIndustry]);

  // Handle form ssion
  const handleSubmit = async () => {
    if (!formData.industry) {
      alert('Please select an industry (required field)');
      return;
    }

    try {
      await getRecommendations(formData);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        {/* Hidden toggle button */}
        <button
          onClick={() => setShowNLTab(prev => !prev)}
          className="fixed top-2 right-2 w-2 h-2 opacity-20 hover:opacity-60 transition rounded-full bg-gray-300"
          title="Toggle AI Text Recommender"
        ></button>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-12">
            <button
              onClick={() => setActiveTab("search")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "search"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Search size={20} />
                Cloud Service Search
              </div>
            </button>
            <button
              onClick={() => setActiveTab("recommender")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "recommender"
                  ? "border-[#6E39CB] text-[#6E39CB]"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap size={20} />
                Cloud Service Recommender
              </div>
            </button>
            {showNLTab && (
              <button
                onClick={() => setActiveTab("nl_recommender")}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === "nl_recommender"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Network size={20} />
                  AI Text Recommender
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === "search" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Search Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cloud Service Search</h2>
              <p className="text-gray-600">
                Search for specific cloud instance types across different providers using our advanced API.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search instance type (e.g., t2, m5, c5, p3, xlarge)..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:border-transparent"
                    disabled={searchLoading}
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="animate-spin text-gray-400" size={20} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={searchLoading || !searchQuery.trim()}
                  className="px-8 py-3 bg-[#6E39CB] text-white rounded-lg hover:bg-[#5A2FA6] transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
              
              {/* Search Tips */}
              <div className="text-sm text-gray-500">
                <p><strong>Search tips:</strong> Try instance families (t2, m5, c5) or specific instance types (e.g., t2.micro, m5.large)</p>
              </div>
            </div>

            {/* Error Display */}
            {searchError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">⚠️ {searchError}</p>
              </div>
            )}

            {/* Results */}
            {showResults && searchResults.length > 0 && (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 font-medium">
                      Found {searchResults.length} cloud instances matching "{searchQuery}"
                    </p>
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages} • Powered by mentorku.cloud API
                    </p>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                      ✓ Real-time API data
                    </div>
                  )}
                </div>
                
                {/* Result Cards Grid */}
                <div className="space-y-4">
                  {paginatedResults.map((result, index) => {
                    // Don't normalize - use raw API data
                    const instanceName = result.instance || result.instance_type || result.instanceType;
                    const provider = result.serviceProvider || result.provider;
                    const vcpu = result.vcpu || result.vCPU;
                    const ram = result.ram || result.RAM;
                    const price = result.price || result.price_per_hour || result.pricePerHour;
                    const industries = result.industries || []; // Array of industries
                    const scales = result.scales || []; // Array of scales
                    const purposes = result.purposes || []; // Array of purposes
                    const category = result.category;
                    const region = result.region;
                    const cardId = `${instanceName}-${provider}-${startIndex + index}`;
                    const isExpanded = expandedCards.has(cardId);

                    return (
                      <motion.div
                        key={cardId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {/* Simple Card View */}
                        <div className="p-6">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{instanceName}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">{provider}</span> • {region || 'Jakarta'}
                              </p>
                              <div className="flex items-center gap-6 text-sm text-gray-700">
                                <span><strong>vCPU:</strong> {vcpu || 'N/A'}</span>
                                <span>•</span>
                                <span><strong>RAM:</strong> {ram ? `${ram} GB` : 'N/A'}</span>
                                {scales && scales.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span><strong>Scale:</strong> {scales.join(', ')}</span>
                                  </>
                                )}
                              </div>
                              {purposes && purposes.length > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm text-gray-500">Purpose:</span>
                                  <div className="flex gap-1">
                                    {purposes.slice(0, 2).map((purpose, i) => (
                                      <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                        {purpose}
                                      </span>
                                    ))}
                                    {purposes.length > 2 && (
                                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                        +{purposes.length - 2} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Industries Display */}
                              {industries && industries.length > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm text-gray-500">Industries:</span>
                                  <div className="flex gap-1 flex-wrap">
                                    {industries.slice(0, 3).map((industry, i) => (
                                      <span key={i} className="px-2 py-1 bg-[#6E39CB]/10 text-[#6E39CB] text-xs rounded font-medium">
                                        {industry.replace(/_/g, ' ')}
                                      </span>
                                    ))}
                                    {industries.length > 3 && (
                                      <span className="px-2 py-1 bg-[#6E39CB]/10 text-[#6E39CB] text-xs rounded font-medium">
                                        +{industries.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              {price ? (
                                <p className="text-lg font-bold text-green-600 mb-2">
                                  ${typeof price === 'number' ? price.toFixed(4) : price}/hour
                                </p>
                              ) : (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-500">Pricing Info</p>
                                  <p className="text-xs text-gray-400">Use Recommender for pricing</p>
                                </div>
                              )}
                              <button
                                onClick={() => toggleCardDetail(cardId)}
                                className="px-4 py-2 bg-[#6E39CB] text-white text-sm rounded-lg hover:bg-[#5A2FA6] transition-colors"
                              >
                                {isExpanded ? 'Hide Detail' : 'View Detail'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Detail View */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                              {/* Left: Related Scenarios */}
                              <div className="lg:col-span-1">
                                <h4 className="font-semibold text-gray-800 mb-3">Instance Details:</h4>
                                <div className="space-y-3 text-sm">
                                  {/* Basic Information */}
                                  <div>
                                    <p className="text-gray-600 mb-1">• <strong>Region:</strong> {region}</p>
                                    {price && (
                                      <p className="text-gray-600 mb-1">• <strong>Price:</strong> <span className="text-green-600 font-medium">${typeof price === 'number' ? price.toFixed(4) : price}/hour</span></p>
                                    )}
                                  </div>
                                  
                                  {/* Scales */}
                                  {scales.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <p className="text-gray-600">• <strong>Scale:</strong></p>
                                      <div className="flex gap-1">
                                        {scales.map((scale, i) => (
                                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                            {scale}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Purpose */}
                                  {purposes.length > 0 && (
                                    <div>
                                      <p className="text-gray-600 mb-1">• <strong>Purpose:</strong></p>
                                      <div className="flex gap-1 ml-4">
                                        {purposes.map((purpose, i) => (
                                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                            {purpose}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Industries */}
                                  {industries.length > 0 && (
                                    <div>
                                      <p className="text-gray-600 mb-1">• <strong>Suitable Industries ({industries.length}):</strong></p>
                                      <div className="grid grid-cols-4 gap-1 ml-4 max-h-32 overflow-y-auto">
                                        {industries.map((industry, i) => (
                                          <span key={i} className="px-2 py-1 bg-[#6E39CB]/10 text-[#6E39CB] text-xs rounded font-medium">
                                            {industry.replace(/_/g, ' ')}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* Show match information */}
                                {result.matchedBy && (
                                  <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    Found by: {result.matchedBy} ({result.matchedValue})
                                  </div>
                                )}
                              </div>
                              
                              {/* Right: Knowledge Graph */}
                              <div className="lg:col-span-1">
                                <h4 className="font-semibold text-gray-800 mb-3">Knowledge Graph :</h4>
                                <div className="h-[350px] w-full border border-gray-200 rounded-lg overflow-hidden">
                                  <KnowledgeGraph 
                                    recommendations={[result]} // Pass single instance as array
                                    formData={{
                                      industries: result.industries || [],
                                      scales: result.scales || [],
                                      orderBy: 'Best Match'
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            pageNum === currentPage
                              ? 'bg-[#6E39CB] text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* No Results State */}
            {showResults && searchResults.length === 0 && !searchLoading && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cloud instances found</h3>
                <p className="text-gray-600 mb-4">
                  No instances match your search term "{searchQuery}". Try different keywords:
                </p>
                <div className="text-sm text-gray-500">
                  <p>Instance families: <strong>t2</strong>, <strong>t3</strong>, <strong>m5</strong>, <strong>c5</strong>, <strong>p3</strong>, or specific instance types</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!showResults && !searchLoading && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Search Cloud Instances</h3>
                <p className="text-gray-600 mb-4">
                  Use our advanced API to find cloud instances across different providers
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800 mb-2"><strong>Popular searches:</strong></p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['t2', 'm5', 'xlarge'].map((term) => (
                      <button
                        key={term}
                        onClick={async () => {
                          setSearchQuery(term);
                          const results = await searchServices(term);
                          setShowResults(results.length > 0);
                          setCurrentPage(1);
                          setExpandedCards(new Set());
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "recommender" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Cloud Service Recommender</h2>
              <p className="text-gray-600">
                Get cloud service recommendations based on your specific requirements
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              {/* Row 1: Industry & Scale */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => handleFormChange({...formData, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:border-transparent"
                    disabled={industriesLoading}
                  >
                    <option value="">Choose Industry</option>
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.value}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Scale</label>
                  <select 
                    value={formData.scale}
                    onChange={(e) => handleFormChange({...formData, scale: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:border-transparent"
                    disabled={scalesLoading}
                  >
                    <option value="">Choose Business Scale</option>
                    {scales.map((scale) => (
                      <option key={scale.id} value={scale.value}>
                        {scale.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Purposes & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Purposes</label>
                  <TagInput
                    options={purposes}
                    selectedTags={formData.purposes}
                    onChange={(tags) => handleFormChange({...formData, purposes: tags})}
                    placeholder="Select purposes..."
                    loading={purposesLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => handleFormChange({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:border-transparent"
                    disabled={categoriesLoading}
                  >
                    <option value="">Choose Category</option>
                    {categories
                      .filter((category) => category.value.toLowerCase() === "compute")
                      .map((category) => (
                        <option key={category.id} value={category.value}>
                          {category.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>

              {/* Row 3: Region & Providers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleFormChange({...formData, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:border-transparent bg-gray-50"
                    placeholder="Jakarta"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Providers</label>
                  <TagInput
                    options={providers}
                    selectedTags={formData.providers}
                    onChange={(tags) => handleFormChange({...formData, providers: tags})}
                    placeholder="Select providers..."
                    loading={providersLoading}
                  />
                </div>
              </div>

              {/* Row 4: Price & Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Price Limit</label>
                  <input
                    type="text"
                    value={formData.priceLimit}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Hanya izinkan angka dan maksimal satu titik desimal
                      if (/^\d*(\.\d{0,4})?$/.test(val) || val === "") {
                        handleFormChange({ ...formData, priceLimit: val });
                      }
                    }}
                    placeholder="Set Price Limit (USD/Hour)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:border-transparent bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Ranked by</label>
                  <select 
                    value={formData.orderBy}
                    onChange={(e) => handleFormChange({...formData, orderBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:border-transparent"
                  >
                    <option>Price (Low to High)</option>
                    <option>Balanced</option>
                    <option>Performance</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Submit Button Only */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={recommendationsLoading || !formData.industry}
                  className={`px-16 py-3 rounded-md font-medium transition-colors flex items-center gap-2 text-lg ${
                    recommendationsLoading || !formData.industry
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-[#6E39CB] hover:bg-[#5A2FA6] text-white'
                  }`}
                >
                  {recommendationsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {recommendationsLoading ? 'Getting Recommendations...' : 'Get Recommendation'}
                </motion.button>
              </div>
            </div>

            {/* Results Section */}
            {showRecommendations && (
              <RecommendationResultTabs
                recommendations={recommendations}
                formData={formData}
                loading={recommendationsLoading}
                error={recommendationsError}
              />
            )}
          </motion.div>
        )}

        {activeTab === "nl_recommender" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Text-Based Cloud Recommender</h2>
              <p className="text-gray-600">
                Describe your business context in natural language and let AI infer the best cloud configuration.
              </p>
            </div>

            {/* Textarea Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <label className="block text-sm font-medium text-gray-800">Describe your cloud needs</label>
              
              <textarea
                value={nlText}
                onChange={(e) => setNlText(e.target.value)}
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Example: We are a medium fintech company using AWS for analytics in Singapore…"
              />

              <button
                onClick={handleInferRecommend}
                disabled={nlLoading}
                className={`px-10 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition ${
                  nlLoading && "opacity-50 cursor-not-allowed"
                }`}
              >
                {nlLoading ? "Processing..." : "Analyze & Recommend"}
              </button>
            </div>

            {/* Display AI Output */}
            {nlResponse && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <h3 className="text-xl font-bold">Extracted Entities</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(nlResponse.entities, null, 2)}
                </pre>

                <h3 className="text-xl font-bold">Recommendations</h3>

                {nlResponse.recommendation?.length > 0 ? (
                  <RecommendationResultTabs
                    recommendations={nlResponse.recommendation}
                    formData={nlFormData}
                  />
                ) : (
                  <p className="text-gray-500">No recommendations found.</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}