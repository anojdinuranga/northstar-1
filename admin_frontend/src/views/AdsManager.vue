<template>
  <v-container>
    <v-row no-gutters align="center">
      <span class="text-h5">Manage Ads gallery</span>
      <v-spacer/>
      <v-btn large rounded elevation="0" color="black" dark @click="addANewAdItem=true">Add A New Add</v-btn>
    </v-row>
    <v-divider class="my-4"/>

    <v-row no-gutters>
      <v-card class="ma-2 rounded-lg" width="40%" hover ripple v-for="(ad,i) in ads" :key="i">
        <v-img :src="$store.state.s3ResourcesBaseUrl + ad.image"></v-img>
        <v-card-actions>
          <v-row no-gutters>
            <v-btn :href="ad.link" text>Visit Link</v-btn>
            <v-btn @click="deleteAd(ad)" color="red" text>Delete Ad</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-bottom-sheet inset persistent v-if="addANewAdItem" v-model="addANewAdItem">
      <AddNewAd @close="close"/>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";
import AddNewAd from "@/components/AddNewAd.vue";

export default {
  name: "AdsManager",
  components: {AddNewAd},
  data: ()=>({
    search: '',
    ads: [],
    loading: true,
    addANewAdItem: false,
    editing: null
  }),
  methods: {
    deleteAd(ad){
      let confirm = window.prompt("Are you sure you want to delete this ad? Type 'YES' to confirm");

      if(confirm === 'YES'){
        authClient.post('/users/ads/delete-ad', {
          'id': ad.id,
          'image': ad.image
        }).then(res=>{
          console.log(res);
          this.getAds();
        }).catch(err=>{
          console.log(err);
        })
      }
    },
    close(){
      this.addANewAdItem = false;
      this.editing = null;
      this.getAds();
    },
    getAds(){
      this.loading = true;
      authClient.post('/users/ads/get-all').then(res=>{
        this.ads = res.data;
        console.log(this.ads);
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
    },
  },
  mounted() {
    this.getAds();
  }
}
</script>

<style scoped>

</style>
