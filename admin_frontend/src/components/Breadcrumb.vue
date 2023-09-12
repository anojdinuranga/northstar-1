<template>
    <v-container>
      <v-layout>
        <v-flex>
          <v-card>
            <v-card-title primary-title>
              <div class="main-container" >
                <h5 class=" mb-3 fw-bold">{{ title_head }}</h5>
                <div> 
                  <a @click="imgUpload()" href="javascript:void(0)">
                    <div class="main-img-container">
                      <div class="upload-lable">
                          <p tabindex="0" class="mt-4" role="button" data-bs-toggle="popover"
                              data-bs-trigger="focus" title=""
                              data-bs-content="Click below placeholder image (or current image) to upload/change your post image"
                              data-bs-original-title="How to Upload/Change Image">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                  class="feather feather-alert-circle mx-2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="12"></line>
                                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                              </svg>
                          </p>
                      </div>
                      <v-img :src="image_src"
                          class="img-properties" alt=""></v-img>
                        <input  ref="imageUploadFeild" type="file"
                        v-on:change="viewImage( $event)" class="d-none">
                      <v-text-field type="text" hidden v-model="current_file_name"
                          class="d-none"></v-text-field>
                    </div>  
                  </a>
                  <v-text-field class="mt-4" outlined  label="Sub Title" v-model="sub_title"></v-text-field>
                  <v-text-field  outlined  label="Head Title" v-model="head_title"></v-text-field>
                </div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat color="orange" @click="ImageUplaod()">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout> 
      <div v-if="loading" class="loading-backdrop">
        <div class="loading-spinner"></div>
      </div>
    </v-container>
  </template>
  
  <script>
  import {authClient} from "@/plugins/http";
  
  export default {
    props:{
        breadcrumb_key:{
            type: String,
            required: true
        },
        title_head:{
            type: String,
            required: true
        }
    },
    name: "Breadcrumb",
    data: () => ({
      current_file_img: null,
      image_src: "", 
      loading: true,
      exercises: [],
      head_title:"",
      sub_title:"",
      current_file_name:"",
      search: '',
    }),
    methods: {
      imgUpload() {
        this.$refs.imageUploadFeild.click();
      },
      viewImage(event) {
        if (event) {
          this.image_src = URL.createObjectURL(event.target.files[0]);
          this.current_file_img = event.target.files[0]
        }
        
      },
      ImageUplaod(){
        if(this.current_file_img === null){
          this.submitData(this.current_file_name)
        return
        }
          this.loading = true;

          let formData = new FormData();

          if (this.current_file_name !== null) {
              formData.append('name', this.current_file_name);
          }
          formData.append('image', this.current_file_img);
          authClient.post('/image/add', formData).then((response) => {
            let data = response.data[0]
            if(data.status){
                
                this.current_file_name = data.data.image_path
                this.submitData(data.data.image_path)
            }else{
                this.loading = false;
                this.$toast.error({
                    title: 'error',
                    message: data.message,
                });
            }

          }).catch((error) => {
            this.loading = false;
            this.$toast.error({
              title: 'error',
              message: 'error',
          });
              this.loading = false;
          });
        
      },
      submitData(filename){
        authClient.post('/setting/update', {
          "data": [
                    {
                      "key": this.breadcrumb_key,
                      "value": 
                        {
                          "sub_title": this.sub_title,
                          "head_title": this.head_title,
                          "image": filename
                        }
                      }  
                  ]
        }).then((response) => {
          this.loading = false;
          this.loadData()
          let data = response.data[0]
          if(data.status){
            this.$toast.success({
              title: 'Ok',
              message: data.message,
          });
          }else{
            this.loading = false;
            this.$toast.error({
              title: 'error',
              message: data.message,
          });
          }
        }).catch((error) => {
            this.loading = false;
          this.$toast.error({
              title: 'error',
              message: 'error',
          });
          this.loading = false;
        });
      },
      loadData() {
        this.loading = true
        authClient.post('/setting/list', {
          "data": [this.breadcrumb_key]
        }).then((response) => {
          let data = response.data[0]
          let domain = data.data.domain

          if(data.status){
            data.data.result.map(item=>{
              let curent_values = JSON.parse( item.value )
              this.sub_title = curent_values["sub_title"]
              this.head_title = curent_values["head_title"]
              this.current_file_name = curent_values["image"]
              this.image_src = domain+curent_values["image"]
            })
            this.loading = false;
          }else{
            this.loading = false;
            this.$toast.error({
              title: 'error',
              message: data.message,
          });
          }
        }).catch((error) => {
          this.loading = false;
          this.$toast.error({
              title: 'error',
              message: 'error',
          });
          this.loading = false;
        });
      }
    },
    mounted() {
      this.loadData();
    }
  }
  </script>
  
</style>
  
  <style>

    .img-properties {
      width: 75%;
      max-width: 100%;
      height: auto;
      position: relative;
      z-index: 0;
      border-radius: 0.25rem;
      margin: 0 auto;
      display: block;
      max-height: 400px;
      margin-top: 10px;
    }

    .main-container{
      width: 100%;
    }
    .main-img-container{
      background-color: #BBDEFB;
      border-radius: 10px;
      min-height: 15vw;
    }

    .upload-lable{
      position: absolute;
      top: 3rem; /* You can adjust the top margin as needed */
      margin-left: 2rem; /* You can adjust the left margin as needed */
      z-index: 1;
    }

    .loading-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999999;
    }

    .d-none{
      display: none;
    }

    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>