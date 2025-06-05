<template>
  <v-container class="mx-auto mt-12 pa-6 rounded-lg elevation-3" style="max-width: 600px; background-color: white;">
    <h2 class="text-h6 font-weight-bold mb-6 text-center">Change Password</h2>

    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
      dense
      border="left"
      colored-border
      elevation="2"
    >
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="handleSubmit" ref="formRef">
      <v-text-field
        v-model="setting.oldPassword"
        label="Old Password"
        type="password"
        required
        outlined
        dense
        class="mb-4"
      />

      <v-text-field
        v-model="setting.newPassword"
        label="New Password"
        type="password"
        required
        outlined
        dense
        class="mb-4"
      />

      <v-text-field
        v-model="setting.confirmPassword"
        label="Confirm Password"
        type="password"
        required
        outlined
        dense
        class="mb-6"
      />

      <v-btn
        type="submit"
        color="teal"
        class="white--text"
        block
        elevation="2"
      >
        Change Password
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/auth/userAuth';

const router = useRouter()
const { user } = useAuth();

const setting = ref({
  userId: user.value._id,
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const error = ref(null)

const handleSubmit = async () => {
  error.value = null
  if (setting.value.newPassword !== setting.value.confirmPassword) {
    error.value = 'Password not matched'
    return
  }

  try {
    const res = await axios.put('http://localhost:4000/api/settings/change-password', setting.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    if (res.data.success) {
        router.push('/login')
    }
  } catch (err) {
    if (err.response && !err.response.data.success) {
        error.value = err.response.data.message || 'Error occurred'
    } else {
        error.value = 'Network or server error'
    }
  }
}
</script>
