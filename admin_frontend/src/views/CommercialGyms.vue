<template>
  <v-container>

    <v-row no-gutters>
      <v-text-field hint="Press ENTER to Search" @change="getGyms()" v-model="search" outlined rounded label="Search Commercial Gyms..."></v-text-field>
      <v-btn @click="addNew = true" rounded dark color="black" height="56" elevation="0" class="ml-2">
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-row>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <v-row no-gutters justify="start">
      <v-card @click="openGymDetails(gym)" width="300" class="ma-2 rounded-lg" hover ripple v-for="(gym,i) in gyms" :key="i">
        <v-card-title class="mb-0 pb-0">
          <v-spacer/>
          <v-avatar size="80">
            <v-img :src="$store.state.s3BaseUrl + gym.user.avatar_url"></v-img>
          </v-avatar>
        </v-card-title>
        <v-card-title class="pt-0">{{ gym.gym_name }}</v-card-title>
        <v-card-subtitle>{{ gym.gym_address }}</v-card-subtitle>
      </v-card>
    </v-row>

    <v-bottom-sheet scrollable persistent inset v-model="addNew">
      <AddNewGym @close="addNew = false; getGyms();" type="COM"></AddNewGym>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";
import AddNewGym from "@/components/AddNewGym";

export default {
  name: "CommercialGyms",
  components: {AddNewGym},
  data: () => ({
    search: '',
    loading: true,
    gyms:[],
    addNew: false
  }),
  methods:{
    openGymDetails(gym){
      this.$router.push({name: 'Gym Overview', params: {id: gym.user_id.toString()}})
    },
    getGyms(){
      this.gyms = [];
      this.loading = true;
      let SK = 'ALL'
      if(this.search !== ''){
        SK = this.search;
      }
      authClient.post('gyms/commercial/search',{
        search_key: SK
      }).then((response) => {
        console.log(response.data);
        this.gyms = response.data;
        this.loading = false;
      }).catch((error) => {
        console.log(error);
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getGyms();
  }
}
</script>

<style scoped>

</style>
