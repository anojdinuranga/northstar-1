<template>
    <v-container>
      <v-row no-gutters>
        <v-text-field v-model="search" outlined rounded label="Search Story..."></v-text-field>
        <v-btn :disabled="loading" @click="addStoryDialog = true;editExercise = null; isEdit = false" class="ml-2" rounded height="56" elevation="0" dark>
          <v-icon>mdi-plus</v-icon>
          Add Ad
        </v-btn>
      </v-row>
      <v-card outlined>
        <v-data-table
            :loading="loading"
            :search="search"
            :headers="headers"
            :items="siteAds">
          <template v-slot:item.desc="{ item }">
            <v-btn outlined rounded @click="descriptionViewDialog = true; selectedDescription = item.desc">
              View
            </v-btn>
          </template>
  
          <template v-slot:item.ad_img="{ item }">
            <v-btn outlined rounded target="_blank" :href="'https://north-star-storage.s3.ap-southeast-1.amazonaws.com/' + item.ad_img">
              View
            </v-btn>
          </template>
  
          <template v-slot:item.ad_url="{ item }">
            <v-btn outlined rounded target="_blank" :href="item.ad_url">
              Visit
            </v-btn>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              class="ma-2"
              :color=" item.status === 1 ? 'success': 'warning'"
            >
            {{ item.status === 1 ? 'Active' : 'Disabled' }}
            </v-chip>
          </template>
  
          <template v-slot:item.optional="{ item }">
            <v-btn  :disabled="!item.optional.enabled" @click="optionalViewDialog=true;selectedOptional = item.optional" outlined rounded>
              View
            </v-btn>
          </template>
  
          <template v-slot:item.actions="{ item }">
            <v-btn @click="isEdit = true; site_ads = item; addStoryDialog = true" icon >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="showDeleteConfirmation(item, deleteItem)" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn @click="statusChange(item.id, item.status === 1? 2 : 1)" icon>
              <v-icon :color=" item.status === 2 ? 'success': 'warning'"> {{ item.status === 1 ? 'mdi-cancel' : 'mdi-check' }}</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
  
      <v-dialog max-width="768" persistent v-if="addStoryDialog" v-model="addStoryDialog">
        <AddSiteAd :site_ads='site_ads' :domain="domain" :orderList="orderList" :edit="isEdit" @close="closeDialogs"/>
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
  import AddSiteAd from "@/components/AddSiteAd.vue";
  
  export default {
    name: "SiteAd",
    components: {AddSiteAd},
    data: () => ({
      loading: true,
      domain:'',
      orderList:[],
      addStoryDialog: false,
      descriptionViewDialog:false,
      optionalViewDialog:false,
      selectedOptional: null,
      selectedDescription: null,
      isEdit: false,
      site_ads: null,
      siteAds: [],
      headers: [
        {text: "ID", value: "id"},
        {text: "Name", value: "name"},
        {text: "Duration(S)", value: "duration"},
        {text: "Ad Url", value: "ad_url"},
        {text: "Ad Image", value: "ad_img"},
        {text: "Status", value: "status"},
        {text: "Actions", value: "actions"},
      ],
      search: '',
    }),
    methods: {
      deleteItem(item) {
          authClient.post('delete',{
            tableId: 3,
            resultId: item.id
          }).then((response) => {
            let data = response.data[0]
            if(data.status){
              this.$toast.success({
                title: 'Ok',
                message: data.message,
              });
              this.getSiteAds()

            authClient.post('/users/file-uploads/delete-file',{
            filePath: item.ad_img
            }).then((response) => {
            }).catch((error) => {
              console.log(error);
            });
            
            }else{
              this.loading = false;
              this.$toast.error({
                title: 'error',
                message: data.message,
            });
          }
            
          }).catch((error) => {
            console.log(error);
          });
      },
      showDeleteConfirmation(item, callback) {
        this.$toast.question({
          timeout: 10000, // The time in milliseconds the toast will be displayed
          close: false, // Whether to show the close button
          overlay: true, // Whether to display an overlay behind the toast
          toastOnce: true, // Whether to show the toast only once
          id: 'deleteToast',
          zindex: 999,
          title: 'Confirmation',
          message: 'Are you sure you want to delete?',
          position: 'center',
          buttons: [
            ['<button><b>YES</b></button>', function (instance, toast) {
              callback(item)
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }, true],
            ['<button>NO</button>', function (instance, toast) {
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }],
          ]
        });
      },
      statusChange(id, status) {
        authClient.post('/status/change',{
            status: status,
            tableId: 3,
            resultId: id
          }).then((response) => {
          let data = response.data[0]
          if(data.status){
            this.$toast.success({
              title: 'Ok',
              message: data.message,
          });
          this.getSiteAds()
          }else{
            this.loading = false;
            this.$toast.error({
              title: 'error',
              message: data.message,
          });
          }
          }).catch((error) => {
            console.log(error);
          });
      },
      getSiteAds() {
        authClient.get('/siteAd/list').then((response) => {
          let data = response.data[0]
          if(data.status){
            this.getOrderList();
            this.siteAds = data.data.result;
            this.domain = data.data.domain;
          }else{
            this.loading = false;
            this.$toast.error({
              title: 'error',
              message: data.message,
          });
          }
          this.loading = false;
        }).catch((error) => {
          console.log(error);
          this.loading = false;
        });
      },
      getOrderList() {
        this.loading = true
        authClient.get('/siteAd/order_list').then((response) => {
          let data = response.data[0]
          if(data.status){
          this.orderList = data.data.result;
          }else{
            this.loading = false;
            this.$toast.error({
              title: 'error',
              message: data.message,
          });
          }
          this.loading = false;
        }).catch((error) => {
          console.log(error);
          this.loading = false;
        });
      },
      closeDialogs() {
        this.addStoryDialog = false;
        this.getSiteAds();
      }
    },
    mounted() {
      this.getSiteAds();
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  