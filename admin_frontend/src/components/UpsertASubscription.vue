<template>
  <v-card>
    <v-card-title>
      {{ this.plan !== null ? 'Edit' : 'Add' }} a Subscription
      <v-spacer/>
      <v-btn color="red" icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field v-model="data.name" :rules="[rules.required]" outlined label="Plan Name"/>
        <v-text-field v-model="data.description" :rules="[rules.required]" outlined label="Plan Description"/>
        <v-text-field v-model="data.price" :rules="[rules.required]" outlined label="Price (MVR)"/>
        <v-row no-gutters>
          <v-select :items="durationUnits" item-text="text" item-value="value" v-model="data.duration_unit" :rules="[rules.required]" outlined label="Duration Unit"/>
          <v-text-field type="number" min="1" v-if="data.duration_unit !=='lifetime'" v-model="data.duration_amount" :rules="[rules.required]" outlined label="Duration" class="pl-2"/>
        </v-row>


        <v-switch class="ml-3" label="Discounted" inset v-model="data.discounted"></v-switch>
        <v-text-field append-icon="mdi-percent" type="number" min="0" max="100" v-if="data.discounted" v-model="data.discounted_percentage" :rules="[rules.required]" outlined label="Discounted Percentage" class="pl-2"/>

      </v-form>
    </v-card-text>


    <v-card-actions style="background: #1976d2">
      <v-spacer/>
      <v-btn @click="upsertPlan" large color="white">
        <v-icon class="mr-2">mdi-check</v-icon>
        Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "UpsertASubscription",
  data:()=>({
    loading:false,
    rules: {
      required: value => !!value || 'Required.',
    },
    durationUnits: [
      {text: 'Months', value: 'month'},
      {text: 'Years', value: 'year'},
      {text: 'Lifetime', value: 'lifetime'},
    ],
    data: {
      name:"",
      description:"",
      price:0,
      duration_amount:0,
      duration_unit:"month", // month, year, lifetime
      discounted:false,
      discounted_percentage:0,
    },
    valid: false,
  }),
  methods:{
    upsertPlan(){
      this.$refs.form.validate();
      if(this.valid){
        this.loading = true;
        authClient.post('/admin/subscriptions/upsert', this.data).then(res=>{
          console.log(res);
          this.$emit('close');
        }).catch(err=>{
          console.log(err);
        }).finally(()=>{
          this.loading = false;
        })
      }
    },

    close(){
      this.$emit('close');
    }
  },
  mounted() {
    console.log(this.plan);
    if(this.plan !== null){
      this.data = this.plan;
    }
  },
  props:{
    plan:{
      type:Object,
      default:null
    }
  }
}
</script>

<style scoped>

</style>
