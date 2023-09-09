<template>
  <v-card>
    <v-card-title>
      <v-row no-gutters>
        <span class="headline">{{ edit ? 'Edit':'Add' }} Exercise</span>
        <v-spacer/>
        <v-btn @click="$emit('close')" icon color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>
    <v-divider class="mb-4"/>
    <v-card-text>
      <v-text-field outlined  label="Name of the Exercise" v-model="title"></v-text-field>
      <v-select multiple :items="categoriesList" outlined  label="Category" v-model="categories"></v-select>
      <v-textarea outlined  label="Description" v-model="description" placeholder="Description"></v-textarea>
      <v-row no-gutters>
        <v-file-input v-model="animation"  prepend-icon="" prepend-inner-icon="mdi-paperclip" label="Animation" class="mr-1" outlined></v-file-input>
        <v-file-input v-model="preview"  prepend-icon="" prepend-inner-icon="mdi-paperclip" label="Animation Thumbnail" class="ml-1" outlined></v-file-input>
      </v-row>
      <v-row no-gutters align="center" justify="space-between">
        <span class="text-h6">Optional Information</span>
        <v-switch inset v-model="optional.enabled"/>
      </v-row>
      <div v-if="optional.enabled">
        <v-text-field v-model="optional.limitations" outlined  label="Limitations"></v-text-field>
        <v-text-field v-model="optional.dos" outlined  label="Dos"></v-text-field>
        <v-text-field v-model="optional.donts" outlined  label="Don'ts"></v-text-field>
        <v-text-field v-model="optional.recommendations" outlined  label="Recommendations"></v-text-field>
        <v-text-field v-model="optional.commonMistakes" outlined  label="Common Mistakes"></v-text-field>
      </div>
      <v-row justify="end" no-gutters>
        <v-btn :loading="loading" @click="saveOrUpdate" width="128" elevation="0"  height="56" color="primary">Save</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "AddExerciseDialog",
  props: {
    edit: Boolean,
    exercise: Object
  },
  data: () => ({
    loading: false,
    title: '',
    categories:[],
    description: '',
    animation: null,
    preview: null,
    optional:{
      enabled: false,
      limitations: '',
      dos: '',
      donts: '',
      recommendations: '',
      commonMistakes: ''
    },
    categoriesList:[
      'Compound',
      'Isolation',
      'Push',
      'Pull',
      'Lift',
      'Chest',
      'Shoulder',
      'Back',
      'Leg',
      'Arms',
      'Abdominal & Core',
      'Corrective',
      'Isometric',
      'Stretches',
      'Cardio',
      'Body Weight',
      'Machine',
      'Plyometrics',
      'Unilateral',
      'Bilateral',
      'Other',
    ]
  }),
  methods:{
    updateExercise(){
      if(this.title === '' || this.description === ''){
        window.alert('Please fill all the fields!');
        this.loading = false;
      } else {
        this.loading = true;

        if(this.animation !== null){
          authClient.post('/users/file-uploads/delete-file',{
            filePath: this.exercise.animation_url
          });
        }

        if(this.preview !== null){
          authClient.post('/users/file-uploads/delete-file',{
            filePath: this.exercise.preview_animation_url,
          });
        }

        authClient.post('/users/file-uploads/delete-file',{
          filePath: this.exercise.animation_url
        }).then((response) => {
          authClient.post('/users/file-uploads/delete-file',{
            filePath: this.exercise.preview_animation_url,
          }).then((response) => {
            let formData = new FormData();

            if(this.animation !== null){
              formData.append('animation', this.animation);
            }

            if(this.preview !== null){
              formData.append('preview', this.preview);
            }



            authClient.post('/users/file-uploads/exercise-files',formData).then((response) => {

              let dtx = {
                id: this.exercise.id,
                title: this.title,
                categories: this.categories,
                description: this.description,
                animation_url: this.animation_url,
                preview_animation_url: this.preview_animation_url,
                optional: this.optional
              };

              if(response.data.animation !== 'NA'){
                dtx.animation_url = response.data.animation;
              }

              if(response.data.preview !== 'NA'){
                dtx.preview_animation_url = response.data.preview;
              }

              authClient.post('/fitness/workouts/actions/update',dtx).then((response) => {
                this.loading = false;
                console.log(response);
                this.$emit('close');
              }).catch((error) => {
                console.log(error);
                this.loading = false;
              });
            }).catch((error) => {
              console.log(error);
              this.loading = false;
            });
          }).catch((error) => {
            console.log(error);
          });
        }).catch((error) => {
          console.log(error);
        });
      }
    },
    saveExercise(){
      if(this.title !== '' && this.description !== '' && this.animation !== null && this.preview !== null){
        this.loading = true;
        let formData = new FormData();
        formData.append('animation', this.animation);
        formData.append('preview', this.preview);
        authClient.post('/users/file-uploads/exercise-files',formData).then((response) => {
          authClient.post('/fitness/workouts/actions/new',{
            title: this.title,
            description: this.description,
            categories: this.categories,
            animation_url: response.data.animation,
            preview_animation_url: response.data.preview,
            optional: this.optional
          }).then((response) => {
            this.loading = false;
            console.log(response);
            this.$emit('close');
          }).catch((error) => {
            console.log(error);
            this.loading = false;
          });
        }).catch((error) => {
          console.log(error);
          this.loading = false;
        });
      } else {
        window.alert('Please fill all the fields');
        this.loading = false;
      }
    },
    saveOrUpdate(){
      this.loading = true;
      if(this.edit) {
        this.updateExercise();
      } else {
        this.saveExercise();
      }
    }
  },
  mounted() {
    if(this.edit){
      this.title = this.exercise.title;
      this.categories = this.exercise.categories;
      this.description = this.exercise.description;
      this.animation_url = this.exercise.animation_url;
      this.preview_animation_url = this.exercise.preview_animation_url;
      this.optional = this.exercise.optional;
    }
  }
}
</script>

<style scoped>

</style>
