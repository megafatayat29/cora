import { useState } from 'react';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchServices = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      const queryLower = query.toLowerCase().trim();
      console.log('🔍 Searching for cloud service instances:', queryLower);

      // Use the new instance/search API endpoint
      const response = await fetch('/api/instance/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: queryLower
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const searchResults = await response.json();
      console.log(`🔍 API returned ${searchResults.length} results`);

      // Transform the API results to match our expected format
      const transformedResults = searchResults
        .map((item, index) => {
          // Clean purposes array to remove 'nan', 'Unknown', empty values
          let cleanPurposes = [];
          if (Array.isArray(item.purposes)) {
            cleanPurposes = item.purposes.filter(p => p && typeof p === 'string' &&
              p.trim().toLowerCase() !== 'nan' &&
              p.trim().toLowerCase() !== 'unknown' &&
              p.trim() !== '');
          } else if (typeof item.purpose === 'string' && item.purpose.trim() !== '' &&
            item.purpose.trim().toLowerCase() !== 'nan' &&
            item.purpose.trim().toLowerCase() !== 'unknown') {
            cleanPurposes = [item.purpose.trim()];
          }
          // Only fallback if no valid purposes at all
          if (cleanPurposes.length === 0) {
            cleanPurposes = [];
          }

          // Clean industries array
          const cleanIndustries = Array.isArray(item.industries)
            ? item.industries.filter(i => i && typeof i === 'string' &&
                i.trim().toLowerCase() !== 'nan' &&
                i.trim().toLowerCase() !== 'unknown' &&
                i.trim() !== '')
            : [item.industry || 'General'];

          // Only return if at least one valid purpose and industry
          if (cleanPurposes.length === 0 || cleanIndustries.length === 0) return null;

          // Category fallback
          const validCategory = (!item.category || item.category === 'N/A' || item.category.trim() === '') ? 'Compute' : item.category;

          return {
            id: `search-${index}`,
            instance: item.instance,
            serviceProvider: item.provider,
            provider: item.provider,
            vcpu: item.vcpu,
            ram: item.ram,
            price: item.price && item.price !== 'nan' ? item.price : null,
            category: validCategory,
            region: Array.isArray(item.regions) ? item.regions[0] : (item.region || 'Jakarta'),
            regions: Array.isArray(item.regions) ? item.regions : [item.region || 'Jakarta'],
            purposes: cleanPurposes,
            purpose: cleanPurposes[0],
            scales: Array.isArray(item.scales) ? item.scales : [item.scale || 'Medium'],
            scale: Array.isArray(item.scales) ? item.scales[0] : (item.scale || 'Medium'),
            industries: cleanIndustries,
            industry: cleanIndustries[0],
            matchedBy: 'instance_search',
            matchedValue: item.instance,
            instanceType: item.instance,
            searchSource: 'api_instance_search'
          };
        })
        .filter(Boolean);

      console.log('✅ Transformed search results:', transformedResults.length);
      console.log('📦 Sample transformed result:', transformedResults[0]);
      setSearchResults(transformedResults);
      return transformedResults;
      
    } catch (err) {
      console.error('❌ Error searching services:', err);
      setError(`Failed to search services: ${err.message}`);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { 
    searchResults, 
    loading, 
    error, 
    searchServices,
    setSearchResults,
    setError
  };
};