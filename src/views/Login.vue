<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label>
        Username:
        <input v-model="username" type="text" required />
      </label>
      <label>
        Password:
        <input v-model="password" type="password" required />
      </label>
      <button type="submit">Login</button>
      <!-- Removed Get New Token button -->
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import eos from '../api/eos'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  if (username.value && password.value) {
    try {
      const response = await eos.getTokenViaProxy(username.value, password.value)
      console.log('Login response:', response) // Debug: log full response
      const token = response.AccessToken || response.accessToken
      if (token) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('eosToken', token)
        router.push('/files')
      } else {
        error.value = 'Login failed: No token returned.'
      }
    } catch (e) {
      error.value = 'Login failed: ' + (e.response?.data?.Message || e.message)
    }
  } else {
    error.value = 'Please enter a username and password.'
  }
}

// Removed getNewToken function
</script>

<style scoped>
.login-page { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #eee; border-radius: 8px; }
label { display: block; margin-bottom: 1rem; }
input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; }
button { padding: 0.5rem 1rem; }
.error { color: red; margin-top: 1rem; }
</style>
