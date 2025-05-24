export interface Stickman {
  name: string;
  attributes: string;
}

export const stickmanService = {
  // Test the API connection
  testApi: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/test`);
      return response.json();
    } catch (error) {
      console.error('Error testing API:', error);
      throw error;
    }
  },

  // Get all stickmen
  getStickmen: async (): Promise<Stickman[]> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/stickman`);
      return response.json();
    } catch (error) {
      console.error('Error fetching stickmen:', error);
      throw error;
    }
  }
};
