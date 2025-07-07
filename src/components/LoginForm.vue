<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label>Username:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref('')

function login() {
  error.value = ''
  // TODO: Call Ecrion.EOS.Client Authorization API here
  // On success, emit event or update state to show repository view
  error.value = 'Authentication not implemented.'
}
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 2em auto;
  padding: 2em;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
}
.error {
  color: red;
  margin-top: 1em;
}
</style>
