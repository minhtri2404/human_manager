import router from '@/routes'
import { ref } from 'vue'
import axios from 'axios'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const token = ref(localStorage.getItem('token') || null)

const login = (userData, tokenData) => {
  user.value = userData
  token.value = tokenData
  localStorage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('token', tokenData)
}

const logout = () => {
  user.value = null
  token.value = null
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/')
}

// ✅ Xác thực token khi app khởi động
const verify = async () => {
  const savedToken = localStorage.getItem('token')
  if (!savedToken) {
    logout()
    return
  }

  try {
    const response = await axios.post('http://localhost:4000/api/auth/verify', {} , {
      headers: {
        Authorization: `Bearer ${savedToken}`
      }
    })

    if (response.data.success && response.data.user) {
      user.value = response.data.user
      token.value = savedToken
    }else {
      logout()
    }
  } catch (error) {
    logout()
  }
}


// ✅ Tự động kiểm tra token mỗi 2 phút
setInterval(() => {
  verify()
}, 2 * 60 * 1000)


export function useAuth() {
  return {
    user,
    token,
    login,
    logout,
    verify
  }
}