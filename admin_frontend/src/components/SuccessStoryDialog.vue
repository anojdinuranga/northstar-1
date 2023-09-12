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
                sm="9"
              >
              <span class="err-msg" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Name" class="mr-2" v-model="state.name"></v-text-field>
              
            </v-col> 
            <v-col
                sm="3"
              >
              <span class="err-msg" v-if="v$.age.$error">{{ v$.age.$errors[0].$message }}</span>
              <v-text-field  outlined type="number"  label="Age" class="mr-1" v-model="state.age"></v-text-field>
            </v-col> 
          </v-row>
        
          <span class="err-msg" v-if="v$.description.$error">{{ v$.description.$errors[0].$message }}</span>
          <v-textarea outlined  label="Description" v-model="state.description" placeholder="Description"></v-textarea>
          <v-row no-gutters>
              <v-col
                cols="12"
                sm="6"
              >
              <span class="err-msg" v-if="v$.point_1.$error">{{ v$.point_1.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Point 01" class="mr-1" v-model="state.point_1"></v-text-field>
            </v-col> 
            <v-col
                sm="6"
              >
              <span class="err-msg" v-if="v$.point_2.$error">{{ v$.point_2.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Point 02" class="ml-1" v-model="state.point_2"></v-text-field>
            </v-col> 
          </v-row>
          <v-row no-gutters>
              <v-col
                cols="12"
                sm="6"
              >
              <span class="err-msg" v-if="v$.point_3.$error">{{ v$.point_3.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Point 03" class="mr-1" v-model="state.point_3"></v-text-field>
            </v-col> 
            <v-col
                sm="6"
              >
              <span class="err-msg" v-if="v$.point_4.$error">{{ v$.point_4.$errors[0].$message }}</span>
              <v-text-field  outlined  label="Point 04" class="ml-1" v-model="state.point_4"></v-text-field>
            </v-col> 
          </v-row>
        
        <v-row class="img-container" >
            <v-col  cols="12" sm="6" class="img-container-1">
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
                      <v-img :src="image_src_1"
                          class="img-properties" alt=""></v-img>
                        <input  ref="imageUploadFeild_1" type="file"
                        v-on:change="viewImage( $event)" class="d-none">
                    </div>  
              </a>
              <label for="" class="font-weight-bold">Before Img</label>
            </v-col>
            <v-col cols="12" sm="6" class="img-container-2">
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
        age: "",
        description: "",
        point_1: "",
        point_2: "",
        point_3: "",
        point_4: "",
      })

      const rules = computed(()=>{
        return { 
            name: { required, maxLength:maxLength(200) },
            age: { numeric, required ,maxLength:maxLength(3)},
            description: { required , maxLength:maxLength(2000)},
            point_1: { required  ,maxLength:maxLength(100)},
            point_2: { required ,maxLength:maxLength(100)},
            point_3: { required ,maxLength:maxLength(100)},
            point_4: {  required ,maxLength:maxLength(100)},
          }
      })

      
      const v$ =  useValidate(rules, state)

      return {
        v$,
        state
      }
    },
    name: "SuccessStoryDialog",
    props: {
      edit: Boolean,
      story: Object,
      domain:String
    },
    data: () => ({
      current_file_img_1: null,
      current_file_img_2: null,
      image_src_1: "",
      image_src_2: "", 
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
        }else{
          this.$refs.imageUploadFeild_1.click();
        }
      },
      viewImage(event,type = 1) {
        if (event) {
          if(type == 2){
            this.image_src_2 = URL.createObjectURL(event.target.files[0]);
            this.current_file_img_2 = event.target.files[0]
          }else{
            this.image_src_1 = URL.createObjectURL(event.target.files[0]);
            this.current_file_img_1 = event.target.files[0]
          }
          
        }
        
      },
      submitForm(){
        this.v$.$validate()
        if(this.current_file_img_1 == null || this.current_file_img_2 == null){
          this.$toast.error({
                    title: 'error',
                    message: 'Please Add Both Pictures',
          });
        }

        if (!this.v$.$error) {
          this.loading = true;

          let formData = new FormData();
  
          formData.append('image_1', this.current_file_img_1);
          formData.append('image_2', this.current_file_img_2);
          formData.append('name', this.state.name);
          formData.append('age', this.state.age);
          formData.append('desc', this.state.description);
          formData.append('point_1', this.state.point_1);
          formData.append('point_2', this.state.point_2);
          formData.append('point_3', this.state.point_3);
          formData.append('point_4', this.state.point_4);

          authClient.post('/story/add',formData)
          .then((response) => {
              this.$emit('close');
              this.loading = false;
              // this.loadData()
              let response_data = response.data[0]
              if(response_data.status){
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
          
          formData.append('storyId', this.story.id);
          formData.append('name', this.state.name);
          formData.append('age', this.state.age);
          formData.append('desc', this.state.description);
          formData.append('point_1', this.state.point_1);
          formData.append('point_2', this.state.point_2);
          formData.append('point_3', this.state.point_3);
          formData.append('point_4', this.state.point_4);

          authClient.post('/story/update',formData)
          .then((response) => {
              this.$emit('close');
              this.loading = false;
              // this.loadData()
              let response_data = response.data[0]
              if(response_data.status){
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
      // saveExercise(){
      //   if(this.title !== '' && this.description !== '' && this.animation !== null && this.preview !== null){
      //     this.loading = true;
      //     let formData = new FormData();
      //     formData.append('animation', this.animation);
      //     formData.append('preview', this.preview);
      //     authClient.post('/users/file-uploads/exercise-files',formData).then((response) => {
      //       authClient.post('/fitness/workouts/actions/new',{
      //         title: this.title,
      //         description: this.description,
      //         categories: this.categories,
      //         animation_url: response.data.animation,
      //         preview_animation_url: response.data.preview,
      //         optional: this.optional
      //       }).then((response) => {
      //         this.loading = false;
      //         console.log(response);
      //         this.$emit('close');
      //       }).catch((error) => {
      //         console.log(error);
      //         this.loading = false;
      //       });
      //     }).catch((error) => {
      //       console.log(error);
      //       this.loading = false;
      //     });
      //   } else {
      //     window.alert('Please fill all the fields');
      //     this.loading = false;
      //   }
      // },
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
        this.state.age = this.story.age;
        this.state.description = this.story.desc;
        this.state.point_1 = this.story.point_1;
        this.state.point_2 = this.story.point_2;
        this.state.point_3 = this.story.point_3;
        this.state.point_4 = this.story.point_4;
        this.image_src_1 =  this.domain+ this.story.before_img;
        this.image_src_2 =  this.domain+ this.story.after_img;
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

    .main-container{
      width: 100%;
    }
    .main-img-container{
      background-color: #BBDEFB;
      border-radius: 10px;
      min-height: 15vw;
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
  