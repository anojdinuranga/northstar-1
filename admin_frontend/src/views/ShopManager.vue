<template>
  <v-container>
    <v-row no-gutters class="mb-4">
      <v-card outlined hover ripple dark class="green" width="180">
        <v-card-subtitle class="pb-0">Orders</v-card-subtitle>
        <v-card-title class="pt-0 text-h4">0</v-card-title>
      </v-card>

      <v-card to="/shop/categories" outlined hover ripple class="ml-4" width="180">
        <v-card-subtitle class="pb-0">Categories</v-card-subtitle>
        <v-card-title class="pt-0 text-h4">
          <v-icon>
            mdi-arrow-right
          </v-icon>
        </v-card-title>
      </v-card>
    </v-row>

    <v-row no-gutters>
      <v-text-field v-model="search" outlined rounded label="Search Products..."></v-text-field>
      <v-btn @click="addNew = true;isEdit=false;" rounded dark color="black" height="56" elevation="0" class="ml-2">
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-row>

    <v-card outlined :loading="loading">
      <v-data-table
          :search="search"
          :headers="headers"
          :items="products">

        <template v-slot:item.image_path="{ item }">
          <v-avatar class="ma-2">
            <v-img :src="$store.state.s3ResourcesBaseUrl + item.image_path"></v-img>
          </v-avatar>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editProduct(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-bottom-sheet v-if="addNew" v-model="addNew" inset persistent>
      <v-card class="rounded-t-lg rounded-b-0">
        <v-card-title>
          <v-row no-gutters>
            {{ isEdit ? 'Edit' : 'Add' }} Product
            <v-spacer/>
            <v-btn color="red" icon @click="close()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-form v-if="!isEdit" ref="form" v-model="valid">
            <v-text-field v-model="data.name" outlined label="Name" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.description" outlined label="Description" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.code" outlined label="Product Code" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.price" type="number" min="0" outlined label="Price" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.quantity" type="number" min="0" outlined label="Quantity" :rules="[rules.required]"></v-text-field>
            <v-autocomplete v-model="data.category_id" :items="categories" item-text="name" item-value="id" outlined label="Category" :rules="[rules.required]"></v-autocomplete>
            <v-file-input v-model="image" prepend-icon="" prepend-inner-icon="mdi-image" outlined label="Image" :rules="[rules.required]"></v-file-input>
          </v-form>

          <v-form v-if="isEdit" ref="formEdit" v-model="validEdit">
            <v-text-field v-model="data.name" outlined label="Name" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.description" outlined label="Description" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.code" outlined label="Product Code" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.price" type="number" min="0" outlined label="Price" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="data.quantity" type="number" min="0" outlined label="Quantity" :rules="[rules.required]"></v-text-field>
            <v-autocomplete v-model="data.category_id" :items="categories" item-text="name" item-value="id" outlined label="Category" :rules="[rules.required]"></v-autocomplete>
            <v-file-input v-model="image" prepend-icon="" prepend-inner-icon="mdi-image" outlined label="Image"></v-file-input>
          </v-form>
        </v-card-text>

        <v-card-actions style="background: #1976d2">
          <v-spacer/>
          <v-btn v-if="!isEdit" :loading="loading" @click="addNewProduct" large color="white">
            <v-icon class="mr-2">mdi-check</v-icon>
            Save
          </v-btn>
          <v-btn v-if="isEdit" :loading="loading" @click="saveEdited" large color="white">
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
  name: "ShopManager",
  data: () => ({
    rules: {
      required: value => !!value || 'Required.',
    },
    data: {
      id: null,
      name: '',
      description: '',
      code: '',
      price: 0,
      quantity: 0,
      image_path: '',
      category_id: null,
    },
    valid: false,
    validEdit: false,
    image: null,
    search: '',
    loading: true,
    addNew: false,
    isEdit: false,
    headers: [
      {text: "ID", value: "id"},
      {text: "", value: "image_path", sortable: false},
      {text: "Product Code", value: "code"},
      {text: "Category", value: "category.name"},
      {text: "Name", value: "name"},
      {text: "Price", value: "price"},
      {text: "Quantity", value: 'quantity'},
      {text: "Actions", value: 'actions', sortable: false}
    ],
    products: [],
    categories: [],
  }),
  methods: {
    resetProduct(){
      this.data = {
        id: null,
        name: '',
        description: '',
        code: '',
        price: 0,
        quantity: 0,
        image_path: '',
        category_id: null,
      };
      this.image = null;
    },
    editProduct(item){
      this.isEdit = true;
      this.addNew = true;
      this.data = item;
    },
    saveEdited(){
      console.log('Saving edited product...');
      this.$refs.formEdit.validate();
      if (this.validEdit) {
        this.loading = true;
        if(this.image === null){
          authClient.post('/ecom/products/actions/edit', this.data).then(res => {
            console.log(res);
            this.loading = false;
            this.resetProduct();
            this.close();
          }).catch(err => {
            this.loading = false;
            console.log(err);
            window.alert('Something went wrong. Please try again later.');
          });
        } else {
          authClient.post('/users/file-uploads/delete-file', {
            filePath: this.data.image_path
          }).then(rs => {
            console.log(rs);
            let formData = new FormData();
            formData.append('image', this.image);
            authClient.post('/users/file-uploads/product', formData).then(res => {
              if(res.status === 200){
                let mData = this.data;
                console.log(res.data);
                mData.image_path = res.data.image_path;
                console.log(mData);
                authClient.post('/ecom/products/actions/edit',mData).then(res2 => {
                  if(res2.status === 200){
                    this.loading = false;
                    this.close();
                  }
                }).catch(err => {
                  this.loading = false;
                  console.log(err);
                  window.alert('Something went wrong. Please try again later.');
                });
              }
            }).catch(err => {
              this.loading = false;
              window.alert('Error uploading image');
            });
          });


        }


      }
    },
    addNewProduct() {
      console.log('Adding new product...');
      this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        let formData = new FormData();
        formData.append('image', this.image);
        authClient.post('/users/file-uploads/product', formData).then(res => {
          if(res.status === 200){
            let mData = this.data;
            console.log(res.data);
            mData.image_path = res.data.image_path;
            console.log(mData);
            authClient.post('/ecom/products/actions/add',mData).then(res => {
              if(res.status === 200){
                this.loading = false;
                this.close();
              }
            }).catch(err => {
              this.loading = false;
              console.log(err);
              window.alert('Something went wrong. Please try again later.');
            });
          }
        }).catch(err => {
          this.loading = false;
          window.alert('Error uploading image');
        })
      }
    },
    close() {
      this.addNew = false;
      this.getProducts();
      this.getCategories();
      this.resetProduct();
    },
    getProducts() {
      this.loading = true;
      this.products = [];

      let sk = 'ALL';
      if (this.search !== '') {
        sk = this.search;
      }
      authClient.post('/ecom/products/search', {
        'search_key': this.search,
      })
          .then(response => {
            this.products = response.data;
            console.log(response);
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
          })
    },
    getCategories(){
      authClient.get('/ecom/categories/actions/get', {
        'search_key': this.search,
      }).then(res => {
        if(res.status === 200){
          this.categories = res.data;
        }
      }).catch(err => {
        console.log(err);
      })
    }
  },
  mounted() {
    this.getProducts();
    this.getCategories();
  }
}
</script>

<style scoped>

</style>
