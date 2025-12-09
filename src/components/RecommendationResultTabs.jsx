import { useState } from "react";
import { Search } from "lucide-react";
import KnowledgeGraph from "./KnowledgeGraph";

export default function RecommendationResultTabs({
  recommendations,
  formData,
  loading,
  error
}) {
  const [activeTab, setActiveTab] = useState("results");

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No recommendations found.</p>
      </div>
    );
  }

  // === GROUP INSTANCES (same logic you used) ===
  const grouped = new Map();

  recommendations.forEach(rec => {
    const key = JSON.stringify({
      instance: rec.instance,
      provider: rec.serviceProvider,
      category: rec.category,
      vcpu: rec.vcpu,
      ram: rec.ram,
      price: rec.price
    });

    if (!grouped.has(key)) {
      grouped.set(key, {
        instance: rec.instance,
        provider: rec.serviceProvider,
        category: rec.category,
        vcpu: rec.vcpu,
        ram: rec.ram,
        price: rec.price,
        purposes: [rec.purpose || rec.purposes || "N/A"]
      });
    } else {
      const item = grouped.get(key);
      const newPurpose = rec.purpose || rec.purposes;
      if (!item.purposes.includes(newPurpose)) item.purposes.push(newPurpose);
    }
  });

  const rows = Array.from(grouped.values()).slice(0, 10);
  const totalFound = grouped.size;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* TAB HEADER */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("results")}
            className={`px-6 py-3 font-medium ${
              activeTab === "results"
                ? "text-[#6E39CB] border-b-2 border-[#6E39CB]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Recommendation Results
          </button>

          <button
            onClick={() => setActiveTab("graph")}
            className={`px-6 py-3 font-medium ${
              activeTab === "graph"
                ? "text-[#6E39CB] border-b-2 border-[#6E39CB]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Knowledge Graph
          </button>
        </div>
      </div>

      {/* === TAB: RESULTS === */}
      {activeTab === "results" && (
        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Showing <span className="font-medium">{rows.length}</span> of{" "}
              {totalFound} recommended cloud instances
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">vCPU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RAM</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/hr</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {rows.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{rec.instance}</td>
                    <td className="px-4 py-3">{rec.provider}</td>
                    <td className="px-4 py-3">{rec.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {rec.purposes.map((p, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{rec.vcpu}</td>
                    <td className="px-4 py-3">{rec.ram} GB</td>
                    <td className="px-4 py-3 text-green-600 font-medium">${rec.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === TAB: GRAPH === */}
      {activeTab === "graph" && (
        <div className="p-6">
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-sm text-purple-700">
              Visualizing {rows.length} instance relationships in the knowledge graph.
            </p>
          </div>

          <div className="h-[600px] w-full border rounded-lg overflow-hidden">
            <KnowledgeGraph
              recommendations={rows}
              formData={formData || {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
