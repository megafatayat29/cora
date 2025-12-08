import { useState } from 'react';
import { apiClient } from '../utils/apiClient';

// Custom hook untuk API recommendation
export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendations = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform form data sesuai dengan format API - hanya kirim data yang tidak kosong
      const requestData = {
        industry: formData.industry, // Required field
        ranking_preference: formData.orderBy === "Price (Low to High)" ? "termurah" : 
                           formData.orderBy === "Balanced" ? "balanced" :
                           formData.orderBy === "Performance" ? "terkuat" : "termurah",
        limit: formData.recommendations || 10
      };

      // Hanya tambahkan field jika ada nilainya (tidak kosong)
      if (formData.providers && formData.providers.length > 0) {
        requestData.serviceProvider = formData.providers.map(p => p.value);
      }
      
      if (formData.region && formData.region.trim() !== '') {
        requestData.region = [formData.region];
      }
      
      if (formData.category && formData.category.trim() !== '') {
        requestData.category = [formData.category];
      }
      
      if (formData.purposes && formData.purposes.length > 0) {
        requestData.purpose = formData.purposes.map(p => p.value);
      }
      
      if (formData.scale && formData.scale.trim() !== '') {
        requestData.scale = formData.scale;
      }
      
      if (formData.priceLimit && formData.priceLimit.trim() !== '') {
        requestData.price_limit = parseFloat(formData.priceLimit);
      }

      console.log('🔍 Sending recommendation request:', requestData);
      
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Recommendation response:', data);
      console.log('✅ Sample recommendation item:', data[0]);
      
      // Clean/filter recommendations
      const cleanData = (Array.isArray(data) ? data : (data.recommendations || data.results || []))
        .map((item) => {
          // Clean purposes
          const cleanPurposes = Array.isArray(item.purposes)
            ? item.purposes.filter(p => p && typeof p === 'string' &&
                p.trim().toLowerCase() !== 'nan' &&
                p.trim().toLowerCase() !== 'unknown' &&
                p.trim() !== '')
            : [item.purpose || 'General purpose'];
          // Clean industries
          const cleanIndustries = Array.isArray(item.industries)
            ? item.industries.filter(i => i && typeof i === 'string' &&
                i.trim().toLowerCase() !== 'nan' &&
                i.trim().toLowerCase() !== 'unknown' &&
                i.trim() !== '')
            : [item.industry || 'General'];
          // Category fallback
          const validCategory = (!item.category || item.category === 'N/A' || item.category.trim() === '') ? 'Compute' : item.category;
          // Only return if at least one valid purpose and industry
          if (cleanPurposes.length === 0 || cleanIndustries.length === 0) return null;
          return {
            ...item,
            purposes: cleanPurposes,
            industries: cleanIndustries,
            category: validCategory,
            purpose: cleanPurposes[0],
            industry: cleanIndustries[0],
          };
        })
        .filter(Boolean);
      setRecommendations(cleanData);
      return cleanData;
      
    } catch (err) {
      console.error('❌ Error getting recommendations:', err);
      setError(`Failed to get recommendations: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    recommendations, 
    loading, 
    error, 
    getRecommendations,
    setRecommendations,
    setError
  };
};