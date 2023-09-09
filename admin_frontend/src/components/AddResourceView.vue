<template>
  <v-container>
    <v-progress-linear class="mb-4" v-if="loading"></v-progress-linear>
    <v-row no-gutters class="mb-4">
      <span class="text-h5 black--text font-weight-bold">Add a New Resource</span>
      <v-spacer/>
      <v-btn @click="UpdateOrAddResource" elevation="0" color="primary" >
        <v-icon class="mr-2">mdi-content-save</v-icon>
        Save
      </v-btn>
    </v-row>
    <v-divider class="mb-4"/>
    <v-text-field v-model="title" outlined  label="Title"></v-text-field>
    <v-textarea v-model="description" outlined  label="Description"></v-textarea>
    <v-select v-model="selectedCategory" :items="categories" outlined  label="Category"></v-select>
    <v-file-input v-model="image"  prepend-icon="" prepend-inner-icon="mdi-paperclip" label="Image" class="mr-1" outlined></v-file-input>
    <div style="height: 100%">
      <vue-editor style="height: 800px" v-model="article"/>
    </div>
    <div style="height: 64px;"/>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "AddResourceView",
  props: {
    resource: Object
  },
  data: () => ({
    edit:false,
    loading: false,
    title: "",
    description: "",
    article: '',
    image: null,
    imageLink: null,
    categories: [
        'General',
        'Injury',
        'Diets',
        'Exercises',
        'Hydration',
        'Nutrition',
        'Conditions',
        'Other'
    ],
    selectedCategory: null
  }),
  methods: {

    UpdateResource() {
      if (this.title !== '' && this.description !== '') {
        this.loading = true;
        if(this.image !== null){
          authClient.post('/users/file-uploads/delete-file',{
            filePath: this.resource.image
          }).then(() => {
            let formData = new FormData();
            formData.append('image', this.image);
            authClient.post('/users/file-uploads/resource-files',formData).then((response) => {
              authClient.post('/fitness/resources/actions/add-or-update',{
                id: this.resource.id,
                title: this.title,
                description: this.description,
                image: response.data.image,
                article: this.article,
                category: this.selectedCategory
              }).then((res) => {
                this.$router.push('/resources');
                this.loading = false;
              }).catch(() => {
                this.loading = false;
              });
            }).catch((error) => {
              console.log(error);
            });
          }).catch(() => {
            this.loading = false;
          })
        } else{
          authClient.post('/fitness/resources/actions/add-or-update',{
            id: this.resource.id,
            title: this.title,
            description: this.description,
            image: this.resource.image,
            article: this.article,
            category: this.selectedCategory
          }).then((res) => {
            console.log(res);
            this.loading = false;
            this.$router.push('/resources');
          }).catch(() => {
            this.loading = false;
          });
        }
      } else {
        window.alert('Please fill all the fields');
        this.loading = false;
      }
    },
    AddResource() {
      if(this.title !== '' && this.description !== '' && this.image !== null){
        let formData = new FormData();
        formData.append('image', this.image);
        authClient.post('/users/file-uploads/resource-files',formData).then((response) => {
          authClient.post('/fitness/resources/actions/add-or-update', {
            title: this.title,
            description: this.description,
            image: response.data.image,
            article: this.article,
            category: this.selectedCategory
          }).then((res) => {
            this.loading = false;
            this.$router.push('/resources');
          }).catch(() => {
            this.loading = false;
          });
        }).catch((error) => {
          console.log(error);
        });
      } else {
        window.alert('Please fill all the fields');
        this.loading = false;
      }
    },
    UpdateOrAddResource() {
      console.log(this.resource != null);
      if (this.resource != null) {
        this.UpdateResource();
      } else {
        this.AddResource();
      }
    },
  },
  mounted() {
    if (this.resource != null) {
      this.edit = true;
      this.title = this.resource.title;
      this.description = this.resource.description;
      this.article = this.resource.article;
      this.selectedCategory = this.resource.category;
    }
  }
}
</script>

<style scoped>

</style>
