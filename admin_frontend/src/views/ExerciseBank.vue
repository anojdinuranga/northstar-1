<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Exercise..."></v-text-field>
      <v-btn @click="addExerciseDialog = true;editExercise = null; isEdit = false" class="ml-2" rounded height="56" elevation="0" dark>
        <v-icon>mdi-plus</v-icon>
        Add Exercise
      </v-btn>
    </v-row>
    <v-card outlined>
      <v-data-table
          :loading="loading"
          :search="search"
          :headers="headers"
          :items="exercises">
        <template v-slot:item.description="{ item }">
          <v-btn outlined rounded @click="descriptionViewDialog = true; selectedDescription = item.description">
            View
          </v-btn>
        </template>

        <template v-slot:item.animation="{ item }">
          <v-btn outlined rounded target="_blank" :href="'https://north-star-storage.s3.ap-southeast-1.amazonaws.com/' + item.animation_url">
            View
          </v-btn>
        </template>

        <template v-slot:item.preview="{ item }">
          <v-btn outlined rounded target="_blank" :href="'https://north-star-storage.s3.ap-southeast-1.amazonaws.com/' + item.preview_animation_url">
            View
          </v-btn>
        </template>

        <template v-slot:item.optional="{ item }">
          <v-btn  :disabled="!item.optional.enabled" @click="optionalViewDialog=true;selectedOptional = item.optional" outlined rounded>
            View
          </v-btn>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn @click="isEdit = true; editExercise = item; addExerciseDialog = true" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="deleteExercise(item)" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog max-width="768" persistent v-if="addExerciseDialog" v-model="addExerciseDialog">
      <AddExerciseDialog :exercise='editExercise' :edit="isEdit" @close="closeDialogs"/>
    </v-dialog>

    <v-dialog max-width="768" persistent v-if="optionalViewDialog" v-model="optionalViewDialog">
      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <span class="headline">Optional Information</span>
            <v-spacer/>
            <v-btn @click="optionalViewDialog = false; selectedOptional= null" icon color="red">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
        <v-divider class="mb-4"/>
        <v-card-text>
          <span class="black--text">Limitations: </span>
          <v-row no-gutters>
            <span class="text-h6">{{ selectedOptional.limitations }}</span>
          </v-row>

          <span class="black--text">Dos: </span>
          <v-row no-gutters>
            <span class="text-h6">{{ selectedOptional.dos }}</span>
          </v-row>

          <span class="black--text">Don'ts: </span>
          <v-row no-gutters>
            <span class="text-h6">{{ selectedOptional.donts }}</span>
          </v-row>

          <span class="black--text">Recommendations: </span>
          <v-row no-gutters>
            <span class="text-h6">{{ selectedOptional.recommendations }}</span>
          </v-row>

          <span class="black--text">Common Mistakes: </span>
          <v-row no-gutters>
            <span class="text-h6">{{ selectedOptional.commonMistakes }}</span>
          </v-row>

        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog max-width="768" persistent v-if="descriptionViewDialog" v-model="descriptionViewDialog">
      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <span class="headline">Description</span>
            <v-spacer/>
            <v-btn @click="descriptionViewDialog = false; selectedDescription=''" icon color="red">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
        <v-divider class="mb-4"/>
        <v-card-text>
          {{ selectedDescription }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";
import AddExerciseDialog from "@/components/AddExerciseDialog";

export default {
  name: "ExerciseBank",
  components: {AddExerciseDialog},
  data: () => ({
    loading: true,
    addExerciseDialog: false,
    descriptionViewDialog:false,
    optionalViewDialog:false,
    selectedOptional: null,
    selectedDescription: null,
    isEdit: false,
    editExercise: null,
    exercises: [],
    headers: [
      {text: "ID", value: "id"},
      {text: "Name", value: "title"},
      {text: "Categories", value: "categories"},
      {text: "Description", value: "description"},
      {text: "Animation", value: "animation"},
      {text: "Thumbnail", value: "preview"},
      {text: "Optional", value: "optional"},
      {text: "Actions", value: "actions"},
    ],
    search: '',
  }),
  methods: {
    deleteExercise(exercise) {
      console.log(exercise);
      let result = window.prompt('Are you sure you want to delete this Exercise?. Type "YES" to confirm');
      if (result === 'YES') {
        authClient.post('/users/file-uploads/delete-file',{
          filePath: exercise.animation_url
        }).then((response) => {
          authClient.post('/users/file-uploads/delete-file',{
            filePath: exercise.preview_animation_url,
          }).then((response) => {
            authClient.post('/fitness/workouts/actions/delete', {
              id: exercise.id
            }).then(() => {
              this.getExercises();
              this.closeDialogs();
            });
          }).catch((error) => {
            console.log(error);
          });
        }).catch((error) => {
          console.log(error);
        });
      }
    },
    getExercises() {
      authClient.get('/fitness/workouts/actions/get-all').then((response) => {
        this.exercises = response.data;
        console.log(response);
        this.loading = false;
      }).catch((error) => {
        console.log(error);
        this.loading = false;
      });
    },
    closeDialogs() {
      this.addExerciseDialog = false;
      this.getExercises();
    }
  },
  mounted() {
    this.getExercises();
  }
}
</script>

<style scoped>

</style>
