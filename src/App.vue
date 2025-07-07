<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'

const isAuthenticated = ref(false)
const userInfo = ref(null)
const repoItems = ref([])

function handleLoginSuccess(user, items) {
  isAuthenticated.value = true
  userInfo.value = user
  repoItems.value = items
}
</script>

<template>
  <div class="app-header">
    <img class="mhc-logo" src="https://www.mhcautomation.com/wp-content/uploads/2021/06/Fit-MHC-Logo-02.svg" alt="MHC Automation Logo" />
    <h1 class="app-title">Northstar CCM</h1>
  </div>
  <router-view />
</template>

<style scoped>
.app-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  gap: 1.5rem;
}
.mhc-logo {
  height: 70px;
  margin-bottom: 0;
}
.app-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #005580;
  text-align: left;
  margin: 0;
  letter-spacing: 1px;
  font-family: 'Segoe UI', 'Arial', sans-serif;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
