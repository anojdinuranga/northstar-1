<template>
  <v-card outlined>
    <v-card-title>Basic Details</v-card-title>
    <v-card-text>
      <v-col class="pa-0">
        <v-row class="mb-4" no-gutters v-for="(detail,i) in details" :key="i">
          <v-col>{{ detail.name }}</v-col>
          <v-col cols="auto" class="font-weight-bold">{{ detail.value }}</v-col>
        </v-row>
      </v-col>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "UserBaseDetails",
  props: {
    details: {
      type: Array,
      required: true
    }
  },
}
</script>

<style scoped>

</style>
