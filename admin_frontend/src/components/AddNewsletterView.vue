<template>
  <v-container>
    <v-progress-linear class="mb-4" v-if="loading"></v-progress-linear>
    <v-row no-gutters class="mb-4">
      <span class="text-h5 black--text font-weight-bold">Add/Edit a Newsletter</span>
      <v-spacer/>
      <v-btn @click="UpdateOrAddNewsletter" elevation="0" color="primary" >
        <v-icon class="mr-2">mdi-content-save</v-icon>
        Save
      </v-btn>
    </v-row>
    <v-divider class="mb-4"/>
    <v-text-field v-model="title" outlined  label="Title"></v-text-field>
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
  name: "AddNewsletterView",
  props: {
    resource: Object
  },
  data: () => ({
    edit:false,
    loading: false,
    title: "",
    article: '',
    image: null,
    imageLink: null,
  }),
  methods: {

    UpdateNewsletter() {
      if (this.title !== '' && this.description !== '') {
        this.loading = true;
        if(this.image !== null){
          authClient.post('/users/file-uploads/delete-file',{
            filePath: this.resource.image
          }).then(() => {
            let formData = new FormData();
            formData.append('image', this.image);
            authClient.post('/users/file-uploads/resource-files',formData).then((response) => {
              authClient.post('/fitness/newsletters/actions/add-or-update',{
                id: this.resource.id,
                title: this.title,
                image: response.data.image,
                article: this.article,
              }).then((res) => {
                this.$router.push('/newsletters');
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
          authClient.post('/fitness/newsletters/actions/add-or-update',{
            id: this.resource.id,
            title: this.title,
            image: this.resource.image,
            article: this.article,
          }).then((res) => {
            console.log(res);
            this.loading = false;
            this.$router.push('/newsletters');
          }).catch(() => {
            this.loading = false;
          });
        }
      } else {
        window.alert('Please fill all the fields');
        this.loading = false;
      }
    },
    AddNewsletter() {
      if(this.title !== '' && this.description !== '' && this.image !== null){
        let formData = new FormData();
        formData.append('image', this.image);
        authClient.post('/users/file-uploads/resource-files',formData).then((response) => {
          authClient.post('/fitness/newsletters/actions/add-or-update', {
            title: this.title,
            image: response.data.image,
            article: this.article,
          }).then((res) => {
            this.loading = false;
            this.$router.push('/newsletters');
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
    UpdateOrAddNewsletter() {
      console.log(this.resource != null);
      if (this.resource != null) {
        this.UpdateNewsletter();
      } else {
        this.AddNewsletter();
      }
    },
  },
  mounted() {
    if (this.resource != null) {
      this.edit = true;
      this.title = this.resource.title;
      this.article = this.resource.article;
    }
  }
}
</script>

<style scoped>

</style>
