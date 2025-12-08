import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

// Global singleton cache for industries
let industriesCache = null;
let industriesLoading = false;
let industriesError = null;
const industriesSubscribers = new Set();

// Function to fetch industries once and notify all subscribers
const fetchIndustriesOnce = async () => {
  if (industriesCache || industriesLoading) return;
  
  industriesLoading = true;
  industriesError = null;
  
  // Notify all subscribers about loading state
  industriesSubscribers.forEach(callback => callback({ loading: true, error: null, industries: [] }));
  
  try {
    console.log('🔍 Mengambil data industries dari API (singleton)...');
    const data = await apiClient.get('/industries');
    
    console.log('✅ Berhasil mendapat data industries:', data);
    
    // Transform data dari array string ke object dengan format yang dibutuhkan
    const transformedData = data.map((industry, index) => ({
      id: index + 1,
      name: industry.replace(/_/g, '/'), // Ganti underscore dengan slash untuk display
      value: industry // Simpan value asli untuk API calls
    }));
    
    industriesCache = transformedData;
    industriesError = null;
    
  } catch (err) {
    console.error('❌ Error fetching industries from API:', err);
    
    if (err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
      console.log('🔄 CORS error detected, using fallback data...');
      industriesError = 'CORS error - using fallback data';
      
      // Fallback data berdasarkan API response yang kita tau
      const fallbackData = [
        "AI_ML", "Agriculture", "Automotive", "Banking", "BigData_Analytics", 
        "Cybersecurity", "Ecommerce", "Education", "Energy", "Fintech", 
        "Gaming", "Government", "Healthcare", "IoT_Platforms", "Logistics", 
        "Manufacturing", "Media_and_Entertainment", "Pharmaceutical", "Retail", "Telecommunications"
      ];
      
      const transformedData = fallbackData.map((industry, index) => ({
        id: index + 1,
        name: industry.replace(/_/g, '/'),
        value: industry
      }));
      
      industriesCache = transformedData;
    } else {
      industriesError = `Failed to fetch industries: ${err.message}`;
    }
  } finally {
    industriesLoading = false;
  }
  
  // Notify all subscribers about final result
  industriesSubscribers.forEach(callback => 
    callback({ loading: false, error: industriesError, industries: industriesCache || [] })
  );
};

// Custom hook untuk mengambil data industri dari API
export const useIndustries = () => {
  const [state, setState] = useState({
    industries: industriesCache || [],
    loading: industriesCache ? false : true,
    error: industriesError
  });

  useEffect(() => {
    // Subscribe to singleton updates
    const handleUpdate = (newState) => {
      setState({
        industries: newState.industries || [],
        loading: newState.loading,
        error: newState.error
      });
    };
    
    industriesSubscribers.add(handleUpdate);
    
    // Fetch industries only once globally
    fetchIndustriesOnce();
    
    return () => {
      industriesSubscribers.delete(handleUpdate);
    };
  }, []);

  return { industries: state.industries, loading: state.loading, error: state.error };
};