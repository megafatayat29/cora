// Utility untuk API calls dengan proxy
const API_BASE_URL = 'https://cora.mentorku.cloud/api'; // Menggunakan proxy yang sudah dikonfigurasi di vite.config.js

export const apiClient = {
  async get(endpoint) {
    try {
      console.log(`🔍 Calling API via proxy: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Success: ${endpoint}`, data);
      return data;

    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  }
};
