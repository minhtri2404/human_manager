<template>
  <v-container>
    <h3 class=" text-center text-h6 font-weight-bold">Dashboard Overview</h3>
    <v-row class="mt-4" dense>
      <v-col cols="12" md="4" v-for="(card, index) in overviewCards" :key="index">
        <ComSummaryCard v-bind="card" />
      </v-col>
    </v-row>

    <h4 class="text-center text-h6 mt-10">Leave Detail</h4>
    <v-row class="mt-4" dense>
      <v-col cols="12" md="3" v-for="(card, index) in leaveCards" :key="index">
        <ComSummaryCard v-bind="card" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ComSummaryCard from '@/components/ComSummaryCard.vue'

const overviewCards = [
  { icon: 'mdi-account-group', text: 'Total Employee', number: 13, color: 'teal-darken-2' },
  { icon: 'mdi-domain', text: 'Total Department', number: 5, color: 'yellow-darken-2' },
  { icon: 'mdi-currency-usd', text: 'Monthly Salary', number: '$655', color: 'red-darken-2' },
]

const leaveCards = [
  { icon: 'mdi-file-document-outline', text: 'Leave Applied', number: 5, color: 'teal-darken-2' },
  { icon: 'mdi-check-circle', text: 'Leave Approved', number: 2, color: 'yellow-darken-2' },
  { icon: 'mdi-timer-sand', text: 'Leave Pending', number: 4, color: 'blue-darken-2' },
  { icon: 'mdi-close-circle', text: 'Leave Rejected', number: 1, color: 'red-darken-2' },
]
</script>
