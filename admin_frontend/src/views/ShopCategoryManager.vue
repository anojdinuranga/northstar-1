<template>
  <v-container>
    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Categories..."></v-text-field>
      <v-btn @click="addNew = true;isEdit=false;" rounded dark color="black" height="56" elevation="0" class="ml-2">
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-row>

    <v-card outlined :loading="loading">
      <v-data-table
          :search="search"
          :headers="headers"
          :items="categories">
        <!--        <template v-slot:item.image_path="{ item }">
                  <v-avatar class="ma-2">
                    <v-img :src="$store.state.s3ResourcesBaseUrl + item.image_path"></v-img>
                  </v-avatar>
                </template>-->
        <template v-slot:item.actions="{ item }">
          <v-icon @click="editCategory(item)" class="mr-2" color="primary">mdi-pencil</v-icon>
          <v-icon @click="deleteCategory(item)" color="error">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-bottom-sheet v-if="addNew" v-model="addNew" inset persistent>
      <v-card class="rounded-t-lg rounded-b-0">
        <v-card-title>
          <v-row no-gutters>
            {{ isEdit ? 'Edit' : 'Add' }} Category
            <v-spacer/>
            <v-btn color="red" icon @click="close()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="data.name" outlined label="Name" :rules="[rules.required]"></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions style="background: #1976d2">
          <v-spacer/>
          <v-btn :loading="loading" @click="addNewCategory" large color="white">
            <v-icon class="mr-2">mdi-check</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import {authClient} from "@/plugins/http";

export default {
  name: "ShopCategoryManager",
  data: () => ({
    rules: {
      required: value => !!value || 'Required.',
    },
    data: {
      id: null,
      name: '',
    },
    valid: false,
    image: null,
    search: '',
    loading: true,
    addNew: false,
    isEdit: false,
    headers: [
      {text: "ID", value: "id"},
      {text: "Name", value: "name"},
      {text: "Actions", value: "actions", sortable: false},
    ],
    categories: [],
  }),
  methods: {
    deleteCategory(item) {
      let result = window.prompt("Are you sure you want to delete this category? Type 'YES' to confirm.");
      if (result === 'YES') {
        authClient.post('/shop/categories/' + item.id)
            .then(() => {
              this.getCategories();
            })
            .catch(() => {
              this.$store.dispatch('showSnackbar', {
                color: 'error',
                text: 'An error occurred while deleting the category.'
              });
            });
      }
    },
    editCategory(item) {
      this.data = item;
      this.isEdit = true;
      this.addNew = true;
    },
    addNewCategory() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        authClient.post('/ecom/categories/actions/upsert', this.data).then(res => {
          console.log(res);
          if (res.status === 200) {
            this.loading = false;
            this.close();
            this.data = {
              id: null,
              name: '',
            };
          }
        }).catch(err => {
          this.loading = false;
          console.log(err);
          window.alert('Something went wrong. Please try again later.');
        });
      }
    },
    close() {
      this.data = {
        id: null,
        name: '',
      };
      this.addNew = false;
      this.getCategories();
    },
    getCategories() {
      this.loading = true;
      this.data = {
        id: null,
        name: '',
      };
      authClient.get('/ecom/categories/actions/get', {
        'search_key': this.search,
      }).then(res => {
        if (res.status === 200) {
          this.categories = res.data;
          this.loading = false;
        }
      }).catch(err => {
        console.log(err);
        this.loading = false;
      })
    }
  },
  mounted() {
    this.getCategories();
  }
}
</script>

<style scoped>

</style>
