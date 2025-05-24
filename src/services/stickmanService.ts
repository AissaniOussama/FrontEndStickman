export interface Stickman {
  name: string;
  hat: string;  // laut deiner Backend-Klasse
}

const BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL || 'http://localhost:8080';

export const stickmanService = {
  // Testverbindung zur API
  testApi: async (): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${BASE_URL}/api/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error testing API:', error);
      throw error;
    }
  },

  // Holt alle Stickmen
  getStickmen: async (): Promise<Stickman[]> => {
    try {
      const response = await fetch(`${BASE_URL}/api/stickmans`);
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
