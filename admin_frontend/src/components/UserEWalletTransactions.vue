<template>
  <v-card outlined elevation="0">
    <v-card-title>
      <v-icon>mdi-wallet</v-icon>
      <span class="ml-2">eWallet Transactions History</span>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="transactions"
        :loading="loading"
        :items-per-page="10"
        class="elevation-1">
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at.split('T')[0] }}
      </template>
      <template v-slot:item.type="{ item }">
        <v-chip dark :color="item.type === 'credit' ? 'green' : 'red'">{{ item.type }}</v-chip>
      </template>
      <template v-slot:item.amount="{ item }">
        <span v-if="item.type === 'credit'">+{{ item.amount }}</span>
        <span v-else>-{{ item.amount }}</span>
      </template>
    </v-data-table>
  </v-card>

</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "UserEWalletTransactions",
  props:{
    user_id:{
      required: true
    }
  },
  data: () => ({
    transactions: [],
    loading: true,
    headers: [
      { text: 'Date', value: 'created_at' },
      { text: 'Amount', value: 'amount' },
      { text: 'Type', value: 'type' },
      { text: 'Reason', value: 'description' },
    ],
  }),
  methods:{
    getTransactions(){
      this.loading = true;
      authClient.post('/wallet/get-user-history',{
        userID:this.user_id
      }).then(value => {
        this.transactions = value.data;
        console.log(value.data);
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getTransactions();
  }
}
</script>

<style scoped>

</style>
