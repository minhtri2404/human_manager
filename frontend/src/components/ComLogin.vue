<template>
  <v-app>
    <div class="login-container">
      <v-card class="login-card" elevation="4">
        <div class="login-logo">
          <v-avatar color="primary" size="80">
            <v-icon size="48" color="white">mdi-account</v-icon>
          </v-avatar>
        </div>

        <h2 class="auth-title text-h4 font-weight-bold">Đăng nhập</h2>

        <v-form @submit.prevent="login" v-model="formValid" class="login-form">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            :rules="emailRules"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-text-field
            v-model="password"
            label="Mật khẩu"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :rules="passwordRules"
            variant="outlined"
            density="comfortable"
            required
          />

          <div class="d-flex justify-space-between align-center">
            <v-checkbox
              v-model="rememberMe"
              label="Nhớ mật khẩu"
              density="compact"
              hide-details
            />
            <v-btn variant="text" color="primary" density="compact" class="text-caption">
              Quên mật khẩu?
            </v-btn>
          </div>

          <v-btn
            type="submit"
            color="primary"
            block
            :loading="loading"
            :disabled="!formValid"
            class="mt-4"
            size="large"
          >
            Đăng nhập
          </v-btn>
        </v-form>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuth } from '@/auth/userAuth'


const { login: saveAuthData } = useAuth()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const formValid = ref(true)

//Validation
const emailRules = [
  v => !!v || 'Email là bắt buộc',
  v => /.+@.+\..+/.test(v) || 'Email phải hợp lệ'
]

const passwordRules = [
  v => !!v || 'Mật khẩu là bắt buộc',
  v => v.length >= 4 || 'Mật khẩu phải có ít nhất 4 ký tự'
]

//Login
const login = async (e) => {
  loading.value = true
  e.preventDefault()
  try {
    const response = await axios.post("http://localhost:4000/api/auth/login", {
      email: email.value,
      password: password.value
    })

    if (response.data.success) {
      alert("Đăng nhập thành công")

      //Thay vì lưu localStorage trực tiếp → gọi saveAuthData từ useAuth
      saveAuthData(response.data.user, response.data.token)

      // Chuyển trang tuỳ vào role
      if (response.data.user.role === 'admin') {
        window.location.href = '/admin-dashboard'
      } else {
        window.location.href = '/employee-dashboard'
      }
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
        alert(error.response.data.error) // ← hiện đúng lỗi từ backend
    }else {
        alert("Có lỗi xảy ra, vui lòng thử lại sau")
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import "@/assets/css/login.css";
</style>
