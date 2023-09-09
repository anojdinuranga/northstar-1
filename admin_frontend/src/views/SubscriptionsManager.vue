<template>
  <v-container>
    <v-row no-gutters align="center">
      <span class="text-h5">Manage Subscription Plans</span>
      <v-spacer/>
      <v-btn large rounded elevation="0" color="black" dark @click="upsertASubscription=true">Add A Plan</v-btn>
    </v-row>
    <v-divider class="my-4"/>

    <v-row no-gutters>
      <v-card class="ma-2 rounded-lg" @click="edit(plan)" width="40%" hover ripple v-for="(plan,i) in plans" :key="i">
        <v-card-title>
          {{ plan.name }}
          <v-spacer/>
          <v-chip color="amber" v-if="plan.discounted" dark>{{ plan.discounted_percentage }}% Off Active</v-chip>
        </v-card-title>
        <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
        <v-card-title>
          <span class="mr-2" style="text-decoration: line-through;" v-if="plan.discounted">{{ plan.price.toFixed(2) }}MVR</span>
          {{ getDiscountedPrice(plan) }}MVR for<span class="mx-2" v-if="plan.duration_unit !=='lifetime'">{{ plan.duration_amount }}</span>
          {{ plan.duration_unit }}{{plan.duration_amount > 1 ? 's' : '' }}
        </v-card-title>
      </v-card>
    </v-row>

    <v-bottom-sheet inset persistent v-if="upsertASubscription" v-model="upsertASubscription">
      <UpsertASubscription :plan="editing" @close="close"/>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";
import UpsertASubscription from "@/components/UpsertASubscription";

export default {
  name: "SubscriptionsManager",
  components: {UpsertASubscription},
  data: ()=>({
    search: '',
    plans: [],
    loading: true,
    upsertASubscription: false,
    editing: null
  }),
  methods: {
    getDiscountedPrice(plan){
      if(plan.discounted){
        return (plan.price - (plan.price * (plan.discounted_percentage/100))).toFixed(2);
      } else {
        return plan.price.toFixed(2);
      }
    },
    edit(plan){
      console.log(plan);
      this.editing = plan;
      this.upsertASubscription = true;
    },
    close(){
      this.upsertASubscription = false;
      this.editing = null;
      this.getPlans();
    },
    getPlans(){
      this.loading = true;
      authClient.get('/common/subscriptions/get-all').then(res=>{
        this.plans = res.data;
        console.log(this.plans);
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
    },
  },
  mounted() {
    this.getPlans();
  }
}
</script>

<style scoped>

</style>
