<template>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <span class="headline">{{ edit ? 'Edit':'Add' }} Story</span>
          <v-spacer/>
          <v-btn @click="$emit('close')" icon color="red">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-card-title>
      <v-divider class="mb-4"/>
      <v-card-text>
        <form @submit.prevent="saveOrUpdate()">
          <v-row no-gutters>
              <v-col
                cols="12"
              >
              <span class="err-msg" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Name" class="mr-2" v-model="state.name"></v-text-field>
              
            </v-col> 
          </v-row>
        
          <span class="err-msg" v-if="v$.description.$error">{{ v$.description.$errors[0].$message }}</span>
          <v-textarea outlined  label="Description" v-model="state.description" placeholder="Description"></v-textarea>
          <v-row no-gutters>
              <v-col
                cols="12"
                sm="12"
              >
              <span class="err-msg" v-if="v$.address.$error">{{ v$.address.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Address: " v-model="state.address"></v-text-field>
            </v-col> 
            <v-col
                sm="12"
              >
              <span class="err-msg" v-if="v$.phone.$error">{{ v$.phone.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Phone:"  v-model="state.phone"></v-text-field>
            </v-col> 
          </v-row>
        
        <v-row class="img-container" >

            <v-col  cols="12" sm="6" class="img-container-1">
              <a @click="imgUpload()" href="javascript:void(0)">
                    <div class="vertical-img-container">
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
                      <v-img :src="image_src_1"
                          class="img-properties" alt=""></v-img>
                        <input  ref="imageUploadFeild_1" type="file"
                        v-on:change="viewImage( $event)" class="d-none">
                    </div>  
              </a>
              <label for="" class="font-weight-bold">Before Img</label>
            </v-col>
            <v-col cols="12" sm="6" class="img-container-2">
              <v-row>
                <v-col cols="12">
                  <a @click="imgUpload(2)" href="javascript:void(0)">
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
                          <v-img :src="image_src_2"
                              class="img-properties" alt=""></v-img>
                            <input  ref="imageUploadFeild_2" type="file"
                            v-on:change="viewImage( $event, 2)" class="d-none">
                        </div>  
                  </a>
                </v-col>
                <v-col cols="12" class="img-container-3">
                  <a @click="imgUpload(3)" href="javascript:void(0)">
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
                      <v-img :src="image_src_3"
                          class="img-properties" alt=""></v-img>
                        <input  ref="imageUploadFeild_3" type="file"
                        v-on:change="viewImage( $event, 3)" class="d-none">
                    </div>  
              </a>
                </v-col>
              </v-row>
              <label for="" class="font-weight-bold">After Img</label>
            </v-col>
        </v-row>
        <v-row justify="end" no-gutters>
          <v-btn type="submit" :loading="loading"  width="128" elevation="0"  height="56" color="primary">Save</v-btn>
        </v-row>
      </form>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import {authClient} from "@/plugins/http";
  import useValidate from '@vuelidate/core'
  import { required,numeric, maxLength } from '@vuelidate/validators'
  import { reactive, computed } from "vue";


  export default {
    setup(){
      const state = reactive({
        name: "",
        description: "",
        address: "",
        phone: ""
      })

      const rules = computed(()=>{
        return { 
            name: { required, maxLength:maxLength(200) },
            description: { required , maxLength:maxLength(2000)},
            address: { required  ,maxLength:maxLength(500)},
            phone: { required ,maxLength:maxLength(20)},
          }
      })

      
      const v$ =  useValidate(rules, state)

      return {
        v$,
        state
      }
    },
    name: "PreviousProjectAd",
    props: {
      edit: Boolean,
      story: Object,
      domain:String
    },
    data: () => ({
      current_file_img_1: null,
      current_file_img_2: null,
      current_file_img_3: null,
      image_src_1: "",
      image_src_2: "", 
      image_src_3: "",
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
    }),
    methods:{
      imgUpload(type = 1) {
        if(type == 2){
          this.$refs.imageUploadFeild_2.click();
        }else if( type == 3){
          this.$refs.imageUploadFeild_3.click();
        }else{
          this.$refs.imageUploadFeild_1.click();
        }
      },
      viewImage(event,type = 1) {
        if (event) {
          if(type == 2){
            this.image_src_2 = URL.createObjectURL(event.target.files[0]);
            this.current_file_img_2 = event.target.files[0]
          }else if(type == 3){
            this.image_src_3 = URL.createObjectURL(event.target.files[0]);
            this.current_file_img_3 = event.target.files[0]
          }else{
            this.image_src_1 = URL.createObjectURL(event.target.files[0]);
            this.current_file_img_1 = event.target.files[0]
          }
          
        }
        
      },
      submitForm(){
        this.v$.$validate()
        if(this.current_file_img_1 == null || this.current_file_img_2 == null || this.current_file_img_3 == null){
          this.$toast.error({
                    title: 'error',
                    message: 'Please Add all Pictures',
          });
        }

        if (!this.v$.$error) {
          this.loading = true;

          let formData = new FormData();
  
          formData.append('image_1', this.current_file_img_1);
          formData.append('image_2', this.current_file_img_2);
          formData.append('image_3', this.current_file_img_3);
          formData.append('name', this.state.name);
          formData.append('desc', this.state.description);
          formData.append('address', this.state.address);
          formData.append('phone', this.state.phone);

          authClient.post('/previousProject/add',formData)
          .then((response) => {
              this.loading = false;
              // this.loadData()
              let response_data = response.data[0]
              if(response_data.status){
                this.$emit('close');
                this.$toast.success({
                  title: 'Ok',
                  message: response_data.message,
              });
              }else{
                this.loading = false;
                this.$toast.error({
                  title: 'error',
                  message: response_data.message[0],
              });
              }
            }).catch((error) => {
              console.log(error)
              this.loading = false;
              this.$toast.error({
                  title: 'error',
                  message: 'error',
              });
            });
      }
      },
      updateForm(){
        this.v$.$validate()

        if (!this.v$.$error) {
          this.loading = true;

          let formData = new FormData();
  
          if(this.current_file_img_1 != null) formData.append('image_1', this.current_file_img_1);
          if(this.current_file_img_2 != null) formData.append('image_2', this.current_file_img_2);
          if(this.current_file_img_3 != null) formData.append('image_2', this.current_file_img_3);
          
          formData.append('projectId', this.story.id);
          formData.append('name', this.state.name);
          formData.append('desc', this.state.description);
          formData.append('address', this.state.address);
          formData.append('phone', this.state.phone);

          authClient.post('/previousProject/update',formData)
          .then((response) => {
              this.loading = false;
              // this.loadData()
              let response_data = response.data[0]
              if(response_data.status){
                this.$emit('close');
                this.$toast.success({
                  title: 'Ok',
                  message: response_data.message,
              });
              }else{
                this.loading = false;
                this.$toast.error({
                  title: 'error',
                  message: response_data.message[0],
              });
              }
            }).catch((error) => {
              console.log(error)
              this.loading = false;
              this.$toast.error({
                  title: 'error',
                  message: 'error',
              });
            });
        }else{
        this.loading = false;
        }
      },
      saveOrUpdate(){
        this.loading = true;
        if(this.edit) {
          this.updateForm();
        } else {
          this.submitForm();
        }
      }
    },
    mounted() {
      if(this.edit){
        this.state.name = this.story.name;
        this.state.address = this.story.address;
        this.state.description = this.story.desc;
        this.state.phone = this.story.phone;
        this.image_src_1 =  this.domain+ this.story.image_1;
        this.image_src_2 =  this.domain+ this.story.image_2;
        this.image_src_3 =  this.domain+ this.story.image_3;
      }
    }
  }
  </script>
  
  
  <style scoped>

.img-properties {
      width: 100%;
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

    .img-container-1{
      position: relative;
      width: 100%;
    }

    .img-container-2{
      position: relative;
      width: 100%;
    }

    .img-container-3{
      position: relative;
      width: 100%;
    }

    .main-container{
      width: 100%;
    }
    .main-img-container{
      background-color: #BBDEFB;
      border-radius: 10px;
      min-height: 15vw;
    }

    .vertical-img-container{
      background-color: #BBDEFB;
      border-radius: 10px;
      min-height: 33vw;
    }

    .img-container{
      width: 100%;
      display: flex;
      
    }

    .upload-lable{
      position: absolute;
      top: 1rem; /* You can adjust the top margin as needed */
      margin-left: 1rem; /* You can adjust the left margin as needed */
      z-index: 1;
    }

    .err-msg{
      color: red;
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


  </style>
  