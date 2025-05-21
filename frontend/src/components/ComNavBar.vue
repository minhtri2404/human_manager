<template>
  <v-app-bar color="teal-darken-2" height="65" flat>
    <v-toolbar-title class="text-white">
      Welcome {{ user && user.name ? user.name : 'Guest' }}
    </v-toolbar-title>
    <v-btn color="teal-darken-3" @click="logout" class="text-white" variant="flat">Logout</v-btn>
  </v-app-bar>
</template>

<script setup>
import { useAuth } from '@/auth/userAuth';  // Dùng useAuth để lấy dữ liệu
const { user, logout } = useAuth();  // Lấy user và logout từ useAuth
</script>
