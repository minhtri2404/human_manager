import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/ComLogin.vue'

// Import layouts/views (nếu có)
const AdminDashboard = () => import('@/views/admin/ComDashboard.vue')
const EmployeeDashboard = () => import('@/views/employee/ComEmployee.vue')

const Department = () => import('@/views/admin/department/ComDepartmentList.vue')
const AddDepartment = () => import('@/views/admin/department/ComAddDepartment.vue')
const EditDepartment = () => import('@/views/admin/department/ComEditDepartment.vue')

const Employee = () => import('@/views/admin/employee/ComEmployeeList.vue')
const AddEmployee = () => import('@/views/admin/employee/ComAddEmployee.vue')
const ViewEmployee = () => import('@/views/admin/employee/ComViewEmployee.vue')
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'department',
        name: 'Department',
        component: Department,
      },

      {
        path: 'add-department',
        name: 'AddDepartment',
        component: AddDepartment,
      },

      {
        path: 'department/:id',
        name: 'EditDepartment',
        component: EditDepartment,
      },

      {
        path: 'employee',
        name: 'Employee',
        component: Employee,
      },

      {
        path: 'add-employee',
        name: 'AddEmployee',
        component: AddEmployee,
      },

      {
        path: 'employee/:id',
        name: 'ViewEmployee',
        component: ViewEmployee,
      }
    ]
  },

  

  {
    path: '/employee-dashboard',
    name: 'EmployeeDashboard',
    component: EmployeeDashboard,
    meta: { requiresAuth: true, role: 'employee' }
  },
  
  {
    path: '/',
    redirect: '/login' // hoặc tự động chuyển theo role nếu thích
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresAuth) {
    if (!token || !user) {
      return next('/login')
    }

    if (to.meta.role && user.role !== to.meta.role) {
      return next('/login') // hoặc redirect về trang lỗi nếu cần
    }
  }

  next()
})

export default router
