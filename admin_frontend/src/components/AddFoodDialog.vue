<template>
  <v-card>
    <v-card-title>
      <v-row no-gutters>
        <span class="headline">{{ edit ? 'Edit':'Add' }} Food</span>
        <v-spacer/>
        <v-btn @click="$emit('close')" icon color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>
    <v-divider class="mb-4"/>
    <v-card-text>
      <v-text-field outlined  label="Name" v-model="name"></v-text-field>
      <v-text-field outlined  label="Potion" v-model="portion" placeholder="Type Average Potion: 25grams,1 cup,1 bottle, each, etc.."></v-text-field>
      <v-row no-gutters>
        <v-col class="mr-1">
          <v-text-field outlined  type="number" min="1" label="Calories (g)" v-model="calories"></v-text-field>
          <v-text-field outlined  type="number" min="1" label="Carbs (g)" v-model="carbs"></v-text-field>
          <v-text-field outlined  type="number" min="1" label="Protein (g)" v-model="proteins"></v-text-field>
        </v-col>
        <v-col class="ml-1">
          <v-text-field outlined  type="number" min="1" label="Fat (g)" v-model="fat"></v-text-field>
          <v-text-field outlined  type="number" min="1" label="Saturated Fat (g)" v-model="sat_fat"></v-text-field>
          <v-text-field outlined  type="number" min="1" label="Fibers (g)" v-model="fibers"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end" no-gutters>
        <v-btn :loading="loading" @click="saveOrUpdate" width="128" elevation="0"  height="56" color="primary">Save</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "AddFoodDialog",
  props: {
    edit: Boolean,
    food: Object
  },
  data: () => ({
    loading: false,
    name: '',
    portion: '',
    calories: '',
    carbs: '',
    proteins: '',
    fat: '',
    sat_fat:'',
    fibers: '',
  }),
  methods:{
    updateFood(){
      authClient.post('/fitness/foods/actions/edit', {
        id: this.food.id,
        name: this.name,
        potion: this.portion,
        calories: this.calories,
        carbs: this.carbs,
        proteins: this.proteins,
        fat: this.fat,
        sat_fat: this.sat_fat,
        fibers: this.fibers,
        ingredients: []
      }).then((response) => {
        this.loading = false;
        console.log(response);
        this.$emit('close');
      }).catch((error) => {
        console.log(error);
        this.loading = false;
      });
    },
    saveFood(){
      authClient.post('/fitness/foods/actions/new',{
        name: this.name,
        potion: this.portion,
        calories: this.calories,
        carbs: this.carbs,
        proteins: this.proteins,
        fat: this.fat,
        sat_fat: this.sat_fat,
        fibers: this.fibers,
        ingredients: []
      }).then((response) => {
        console.log(response);
        this.loading = false;
        this.$emit('close');
      }).catch((error) => {
        console.log(error.data);
        this.loading = false;
      }).finally((response) => {
        console.log(response);
        this.loading = false;
      });
    },
    saveOrUpdate(){
      this.loading = true;
      if(this.edit) {
        this.updateFood();
      } else {
        this.saveFood();
      }
    }
  },
  mounted() {
    if(this.edit){
      this.name = this.food.name;
      this.portion = this.food.potion;
      this.calories = this.food.calories;
      this.carbs = this.food.carbs;
      this.proteins = this.food.proteins;
      this.fat = this.food.fat;
      this.sat_fat = this.food.sat_fat;
      this.fibers = this.food.fibers;
    }
  }
}
</script>

<style scoped>

</style>
