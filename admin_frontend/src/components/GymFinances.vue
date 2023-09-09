<template>
 <v-container>
   <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
   <div v-if="!loading">
     <v-row no-gutters>
       <v-card width="256" height="128">
         <v-card-title>Total Earnings</v-card-title>
         <v-card-text>
           <h1>{{ getTotalAmounts().toFixed(2) }} MVR</h1>
         </v-card-text>
       </v-card>
     </v-row>

     <v-divider class="my-4"/>

     <v-card>
       <v-data-table
        :items="records"
        :headers="headers"
       >
         <template v-slot:item.created_at="{ item }">
            {{ item.created_at.split('T')[0] + ' ' + item.created_at.split('T')[1].split('.')[0] }}
         </template>

         <template v-slot:item.amount="{ item }">
            {{ item.amount + ' MVR' }}
          </template>
       </v-data-table>
     </v-card>
   </div>
 </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "GymFinances",
  data() {
    return {
      loading: true,
      records:[],
      headers: [
        {text: "Date", value: "created_at"},
        {text: "Amount", value: "amount"},
        {text: "Payer", value: "user.name"},
        {text: "Payer Email", value: "user.email"},
      ],
    };
  },
  methods:{
    getTotalAmounts(){
      let total = 0;
      this.records.forEach(record => {
        total += record.amount;
      });
      return total;
    },
    getGymFinances() {
      authClient.post('gym-finances/details').then(response => {
        this.loading = false;
        this.records = response.data;
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    }
  },
  mounted() {
    if(this.$store.state.user.role === 'gym'){
      if(this.$router.currentRoute.path !== '/gyms/' + this.$store.state.user.id + '/finances'){
        this.$router.push('/gyms/' + this.$store.state.user.id + '/finances');
      }
    }
    this.getGymFinances();
  }
}
</script>

<style scoped>

</style>
