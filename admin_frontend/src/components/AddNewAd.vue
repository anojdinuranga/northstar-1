<template>
  <v-card>
    <v-card-title>
      Add an Ad
      <v-spacer/>
      <v-btn color="red" icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field v-model="link" outlined label="Ad Link to Open"/>
        <v-file-input v-model="image"  prepend-icon="" prepend-inner-icon="mdi-paperclip" label="Image" class="mr-1" outlined></v-file-input>
      </v-form>
    </v-card-text>


    <v-card-actions style="background: #1976d2">
      <v-spacer/>
      <v-btn @click="upsertAd" :loading="loading" large color="white">
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
    link:"",
    image: null,
    valid: false,
  }),
  methods:{
    upsertAd(){
      this.$refs.form.validate();
      if(this.valid){
        this.loading = true;
        let formData = new FormData();
        formData.append('image', this.image);
        formData.append('link', this.link);
        authClient.post('/users/ads/new-ads-gallery-item', formData).then(res=>{
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
}
</script>

<style scoped>

</style>
