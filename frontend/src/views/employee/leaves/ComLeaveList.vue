<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Tiêu đề căn giữa -->
        <div class="text-center my-4">
          <h2>Manager Leaves</h2>
        </div>

        <!-- Thanh tìm kiếm và nút thêm mới -->
        <v-row class="mb-4" justify="space-between" align="center">
          <v-col cols="6" md="4">
            <v-text-field
              v-model="search"
              label="Search by Dep Name"
              dense
              hide-details
            />
          </v-col>

          <v-col cols="12" md="4" class="text-right">
            <RouterLink to="/employee-dashboard/add-leave">
              <v-btn color="teal" dark>ADD NEW LEAVES</v-btn>
            </RouterLink>
          </v-col>
        </v-row>

        <!-- Danh sách hoặc bảng có thể thêm ở đây sau -->
        <!-- <LeaveTable :search="search" /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
</script>
