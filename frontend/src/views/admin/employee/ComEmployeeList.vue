<template>
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h3 class="text-h5 font-weight-bold">Manage Employee</h3>
      </v-col>
    </v-row>

    <!-- Thanh tìm kiếm và nút -->
    <v-row class="mb-4" justify="space-between" align="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search by Name"
          dense
          hide-details
        />
      </v-col>

      <v-col cols="12" md="4" class="text-right">
        <RouterLink to="/admin-dashboard/add-employee">
          <v-btn color="teal" dark> ADD NEW EMPLOYEE </v-btn>
        </RouterLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'


const search = ref('')
</script>
