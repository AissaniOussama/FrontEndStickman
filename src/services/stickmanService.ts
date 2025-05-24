export interface Stickman {
  name: string;
  attributes: string;
}

export const stickmanService = {
  // Test the API connection
  testApi: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error testing API:', error);
      throw error;
    }
  },

  // Get all stickmen (using the singular endpoint as it's the primary one)
  getStickmen: async (): Promise<Stickman[]> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/stickman`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching stickmen:', error);
      throw error;
    }
  }
};
