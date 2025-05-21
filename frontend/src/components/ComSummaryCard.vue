<template>
  <v-card class="d-flex">
    <v-sheet :color="color" class="pa-4 text-white d-flex align-center justify-center" width="64">
      <v-icon size="32">{{ icon }}</v-icon> 
    </v-sheet>
    <v-card-text>
      <div class="text-subtitle-1 font-weight-medium">{{ text }}</div>
      <div class="text-h6 font-weight-bold">{{ number }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  icon: String,
  text: String,
  number: [Number, String],
  color: String,
});
</script> 

