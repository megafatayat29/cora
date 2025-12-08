import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

// Custom hook untuk mengambil data scales dari API
export const useScales = () => {
  const [scales, setScales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScales = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Panggil API dengan fetch client
        const data = await apiClient.get('/scales');
        
        // Transform data dari array string ke object dengan format yang dibutuhkan
        const transformedData = data.map((scale, index) => ({
          id: index + 1,
          name: scale.replace(/_/g, ' '), // Ganti underscore dengan space untuk display
          value: scale // Simpan value asli untuk API calls
        }));
        
        setScales(transformedData);
        
      } catch (err) {
        console.error('❌ Error fetching scales from API:', err);
        
        if (err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
          console.log('🔄 CORS error detected for scales, using fallback data...');
          setError('CORS error - using fallback data');
          
          // Fallback data untuk scales
          const fallbackData = ["Large", "Medium", "Small"];
          const transformedData = fallbackData.map((scale, index) => ({
            id: index + 1,
            name: scale,
            value: scale
          }));
          
          setScales(transformedData);
        } else {
          setError(`Failed to fetch scales: ${err.message}`);
          setScales([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScales();
  }, []);

  return { scales, loading, error };
};