<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Food..."></v-text-field>
      <v-btn @click="addFoodDialog = true;editFood = null; isEdit = false" class="ml-2" rounded height="56" elevation="0" dark>
        <v-icon>mdi-plus</v-icon>
        Add Food
      </v-btn>
    </v-row>
    <v-card outlined>
      <v-data-table
          :loading="loading"
          :search="search"
          :headers="headers"
          :items="foods">
        <template v-slot:item.actions="{ item }">
          <v-btn @click="isEdit = true; editFood = item; addFoodDialog = true" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="deleteFood(item.id)" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog max-width="768" persistent v-if="addFoodDialog" v-model="addFoodDialog">
      <AddFoodDialog :food='editFood' :edit="isEdit" @close="closeDialogs"/>
    </v-dialog>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";
import AddFoodDialog from "@/components/AddFoodDialog";

export default {
  name: "FoodData",
  components: {AddFoodDialog},
  data: () => ({
    loading: true,
    addFoodDialog: false,
    isEdit: false,
    editFood: null,
    foods: [],
    headers: [
      {text: "ID", value: "id"},
      {text: "Name", value: "name"},
      {text: "Calories (g)", value: "calories"},
      {text: "Fat (g)", value: "fat"},
      {text: "Carbs (g)", value: "carbs"},
      {text: "Protein (g)", value: "proteins"},
      {text: "Actions", value: "actions", sortable: false}
    ],
    search: '',
  }),
  methods: {
    deleteFood(foodID) {
      console.log(foodID);
      let result = window.prompt('Are you sure you want to delete this food?. Type "YES" to confirm');
      if (result === 'YES') {
        authClient.post('/fitness/foods/actions/delete', {
          id: foodID
        }).then(() => {
          this.getFood();
          this.closeDialogs();
        });
      }
    },
    getFood() {
      authClient.get('/fitness/get-all-food').then((response) => {
        this.foods = response.data;
        console.log(response);
        this.loading = false;
      }).catch((error) => {
        console.log(error);
        this.loading = false;
      });
    },
    closeDialogs() {
      this.addFoodDialog = false;
      this.getFood();
    }
  },
  mounted() {
    this.getFood();
  }
}
</script>

<style scoped>

</style>
