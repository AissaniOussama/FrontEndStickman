<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h2 class="custom-font">Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="custom-font">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Deine Email"
            class="custom-font"
          />
        </div>
        <div class="form-group">
          <label for="password" class="custom-font">Passwort:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Dein Passwort"
            class="custom-font"
          />
        </div>
        <div v-if="error" class="error-message custom-font">
          {{ error }}
        </div>
        <button type="submit" class="login-button custom-font">Einloggen</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    // TODO: Implement actual login logic here
    // 1. Validierung der Eingaben
    // 2. API-Call an das Backend über Octa
    // 3. Token-Handling nach erfolgreicher Authentifizierung
    // 4. Fehlerbehandlung für verschiedene Szenarien:
    //    - Falsche Credentials
    //    - Server nicht erreichbar
    //    - Netzwerkfehler

    if (email.value && password.value) {
      // TODO: Ersetzen durch echte Authentifizierung
      localStorage.setItem('isAuthenticated', 'true')
      // TODO: Token im localStorage oder besser in einem sicheren Cookie speichern

      // TODO: Benutzerinformationen vom Backend abrufen
      // TODO: Benutzerinformationen im State Management speichern (Pinia/Vuex)

      router.push('/')
    } else {
      error.value = 'Bitte fülle alle Felder aus'
    }
  } catch (err) {
    // TODO: Spezifische Fehlerbehandlung implementieren
    error.value = 'Login fehlgeschlagen'
  }
}

// TODO: Logout-Funktionalität implementieren
// TODO: "Remember Me" Funktionalität hinzufügen
// TODO: "Passwort vergessen" Link hinzufügen
// TODO: Registrierungs-Link hinzufügen
</script>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.content-wrapper {
  text-align: center;
  padding: 2rem;
}

h2.custom-font {
  font-family: 'HoaxVandal', sans-serif !important;
  font-size: 32px;
  margin-bottom: 2rem;
}

.login-form {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 1.1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #f8f8f8;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.error-message {
  color: #ff0000;
  margin-bottom: 1rem;
  text-align: center;
}

.custom-font {
  font-family: 'HoaxVandal', sans-serif !important;
}

/* TODO: Loading-State für den Login-Button hinzufügen */
/* TODO: Responsive Design für mobile Geräte optimieren */
/* TODO: Dark Mode Unterstützung hinzufügen */
</style>
