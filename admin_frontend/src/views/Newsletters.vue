<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Newsletters..."></v-text-field>
      <v-btn to="/newsletters/add-newsletter" class="ml-2" rounded height="56" elevation="0" dark>
        <v-icon>mdi-plus</v-icon>
        Add A Newsletter
      </v-btn>
    </v-row>
    <v-card outlined>
      <v-data-table
          :loading="loading"
          :search="search"
          :headers="headers"
          :items="resources">

        <template v-slot:item.image="{ item }">
          <v-btn target="_blank" :href="'https://north-star-storage.s3.ap-southeast-1.amazonaws.com/' + item.image" outlined rounded>
            View
          </v-btn>
        </template>

        <template v-slot:item.article="{ item }">
          <v-btn @click="previewHTML(item.article)" outlined rounded>
            Preview
          </v-btn>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn @click="editRes(item)" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="deleteNewsletter(item)" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "Newsletters",
  data: () => ({
    loading: true,
    addFoodDialog: false,
    isEdit: false,
    editFood: null,
    resources: [],
    headers: [
      {text: "ID", value: "id"},
      {text: "Title", value: "title"},
      {text: "Article", value: "article"},
      {text: "Image", value: "image"},
      {text: "Actions", value: "actions", sortable: false}
    ],
    search: '',
  }),
  methods: {
    editRes(Res){
      this.$router.push({name: 'Add Newsletter', params: {resource: Res}})
    },
    previewHTML(html){
      let previewOpen = window.open("", "previewOpen", "width=320, height=720");
      previewOpen.document.body.innerHTML = html;
    },
    deleteNewsletter(Res) {
      console.log(Res);
      let result = window.prompt('Are you sure you want to delete this Newsletter?. Type "YES" to confirm');
      if (result === 'YES') {
        authClient.post('/fitness/newsletters/actions/delete', {
          id: Res.id
        }).then(async () => {
          await authClient.post('/users/file-uploads/delete-file', {
            'filePath': Res.image
          });
          this.getNewsletters();
          this.closeDialogs();
        });
      }
    },
    getNewsletters() {
      authClient.get('/fitness/newsletters/actions/get').then((response) => {
        this.resources = response.data;
        console.log(response);

        this.loading = false;
      }).catch((error) => {
        console.log(error);
        this.loading = false;
      });
    },
    closeDialogs() {
      this.addFoodDialog = false;
      this.getNewsletters();
    }
  },
  mounted() {
    this.getNewsletters();
  }
}
</script>

<style scoped>

</style>
