<template>
  <v-card class="pa-6">
    <v-row class="align-center" v-if="user">
      <v-col
        cols="auto"
        class="d-flex align-center justify-center text-white px-4"
        style="background-color: #0d9488"
      >
        <v-icon icon="mdi-account" size="36" />
      </v-col>
      <v-col>
        <div class="text-lg font-weight-medium">Welcome Back</div>
        <div class="text-xl font-weight-bold">{{ user.name }}</div>
      </v-col>
    </v-row>
  </v-card>
</template>


<script setup>
import { useAuth } from '@/auth/userAuth';
const { user } = useAuth();
</script> 

