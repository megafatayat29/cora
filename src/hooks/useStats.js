import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

// Global singleton cache for stats
let statsCache = null;
let statsLoading = false;
let statsError = null;
const statsSubscribers = new Set();

// Function to fetch stats once and notify all subscribers
const fetchStatsOnce = async () => {
  if (statsCache || statsLoading) return;
  
  statsLoading = true;
  statsError = null;
  
  // Notify all subscribers about loading state
  statsSubscribers.forEach(callback => callback({ loading: true, error: null, stats: null }));
  
  try {
    console.log('🔍 Mengambil data stats dari API (singleton)...');
    const data = await apiClient.get('/stats');
    
    console.log('✅ Berhasil mendapat data stats:', data);
    statsCache = data;
    statsError = null;
  } catch (err) {
    console.error('❌ Error fetching stats from API:', err);
    
    if (err.message.includes('Network Error') || err.code === 'ERR_NETWORK' || err.message.includes('500')) {
      console.log('🔄 Server error detected for stats, using fallback data...');
      statsError = 'Server error - using fallback data';
      
      // Fallback data
      statsCache = {
        services: 1056,
        providers: 3,
        regions: 1,
        industries: 20,
        clusters: 61
      };
    } else {
      statsError = `Failed to fetch stats: ${err.message}`;
    }
  } finally {
    statsLoading = false;
  }
  
  // Notify all subscribers about final result
  statsSubscribers.forEach(callback => 
    callback({ loading: false, error: statsError, stats: statsCache })
  );
};

// Custom hook untuk mengambil data statistik dari API
export const useStats = () => {
  const [state, setState] = useState({
    stats: statsCache || {
      services: 0,
      providers: 0,
      regions: 0,
      industries: 0,
      clusters: 0
    },
    loading: statsCache ? false : true,
    error: statsError
  });

  useEffect(() => {
    // Subscribe to singleton updates
    const handleUpdate = (newState) => {
      setState({
        stats: newState.stats || state.stats,
        loading: newState.loading,
        error: newState.error
      });
    };
    
    statsSubscribers.add(handleUpdate);
    
    // Fetch stats only once globally
    fetchStatsOnce();
    
    return () => {
      statsSubscribers.delete(handleUpdate);
    };
  }, []);

  return { stats: state.stats, loading: state.loading, error: state.error };
};