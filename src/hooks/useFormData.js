import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

// Custom hook untuk mengambil data purposes dari API
export const usePurposes = () => {
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiClient.get('/purposes');
        
        // Transform data dari array string ke object
        const transformedData = data.map((purpose, index) => ({
          id: index + 1,
          name: purpose,
          value: purpose
        }));
        
        setPurposes(transformedData);
        
      } catch (err) {
        console.error('❌ Error fetching purposes from API:', err);
        setError(`Failed to fetch purposes: ${err.message}`);
        setPurposes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurposes();
  }, []);

  return { purposes, loading, error };
};

// Custom hook untuk mengambil data providers dari API  
export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiClient.get('/providers');
        
        const transformedData = data.map((provider, index) => ({
          id: index + 1,
          name: provider,
          value: provider
        }));
        
        setProviders(transformedData);
        
      } catch (err) {
        console.error('❌ Error fetching providers from API:', err);
        setError(`Failed to fetch providers: ${err.message}`);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { providers, loading, error };
};

// Custom hook untuk mengambil data categories dari API
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiClient.get('/categories');
        
        const transformedData = data.map((category, index) => ({
          id: index + 1,
          name: category,
          value: category
        }));
        
        setCategories(transformedData);
        
      } catch (err) {
        console.error('❌ Error fetching categories from API:', err);
        setError(`Failed to fetch categories: ${err.message}`);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};