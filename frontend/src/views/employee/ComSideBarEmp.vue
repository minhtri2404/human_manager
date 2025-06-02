<template>
  <v-navigation-drawer permanent width="250" color="grey-darken-4">
    <v-sheet color="teal-darken-2" height="64" class="d-flex align-center justify-center">
      <h3 class="text-white text-h5 text-center">HMS</h3>
    </v-sheet>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        link
        :prepend-icon="item.icon"
        :exact="true" 
        exact-active-class="active-item" 
      >
        <v-list-item-title class="text-subtitle-1">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const items = [
  { title: "Dashboard", icon: "mdi-view-dashboard", to: "/employee-dashboard" },
  { title: "My Profile", icon: "mdi-account-group", to: "/admin-employee/myProfile" },
  { title: "Leaves", icon: "mdi-calendar-month", to: "/admin-employee/leaves" },
  { title: "Salary", icon: "mdi-currency-usd", to: "/admin-employee/salary" },
  { title: "Settings", icon: "mdi-cog", to: "/admin-employee/settings" },
];
</script>

<style scoped>
.text-subtitle-1 {
  font-size: 16px !important;
  font-weight: 500;
}

.active-item {
  background-color: #004d40 !important; 
  color: #f5f1f1 !important;           
}

/* Thêm màu icon khi active */
.active-item .v-icon {
  color: #fcfffd !important;           
}

/* Tăng hiệu ứng khi hover (tùy chọn) */
.v-list-item:hover {
  background-color: #00695c !important;
  color: #08ef3a !important;
}
</style>
