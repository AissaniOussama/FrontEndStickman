export interface Stickman {
  name: string;
  hat: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const stickmanService = {
  // Testet die API-Verbindung (z. B. /api/test)
  testApi: async (): Promise<{ message: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/test`);
      const contentType = res.headers.get('content-type');

      if (!res.ok || !contentType?.includes('application/json')) {
        const text = await res.text();
        console.error('❌ Server Response (testApi):', text);
        throw new Error('Antwort ist kein gültiges JSON.');
      }

      return res.json();
    } catch (error) {
      console.error('❌ API-Fehler beim testApi:', error);
      throw error;
    }
  },

  // Holt alle Stickmen von /api/stickmans
  getStickmen: async (): Promise<Stickman[]> => {
    try {
      const url = `${BASE_URL}/api/stickmans`;
      console.log('📡 API-Call:', url);

      const res = await fetch(url);
      const contentType = res.headers.get('content-type');

      if (!res.ok || !contentType?.includes('application/json')) {
        const text = await res.text();
        console.error('❌ Server Response (getStickmen):', text);
        throw new Error('Antwort ist kein gültiges JSON.');
      }

      const data = await res.json();
      console.log('✅ Stickman-Daten erfolgreich geladen:', data);
      return data;
    } catch (error) {
      console.error('❌ API-Fehler beim Laden der Stickman-Daten:', error);
      throw error;
    }
  }
};

