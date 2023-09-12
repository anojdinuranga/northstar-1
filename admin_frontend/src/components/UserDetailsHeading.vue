<template>
  <div>
    <v-row align="center" no-gutters>
              <a v-if="data.role === 'therapy'"  @click="imgUpload()" href="javascript:void(0)" max-height="128" min-width="128" min-height="128" max-width="128">
                    <div class="dp_change" max-height="128" min-width="128" min-height="128" max-width="128">
                      <div class="upload-lable" max-height="128" min-width="128" min-height="128" max-width="128">
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
                      <v-img  :src="image_src_1"
                          class="img-properties" alt="" max-height="128" min-width="128" min-height="128" max-width="128"></v-img>
                        <input  ref="imageUploadFeild_1" type="file" accept='image/*'
                        v-on:change="viewImage( $event)" class="d-none" >
                    </div>  
              </a>
      <v-img v-if="data.role != 'therapy'" class="rounded-xl" max-height="128" min-width="128" min-height="128" max-width="128" :src=" $store.state.s3BaseUrl + data.avatar_url"></v-img>
      <v-col class="ml-8">
        <span class="text-h4 font-weight-bold">{{ data.name }}</span><br>
        <v-chip v-if="(data.role !=='doctor') && (data.role !=='therapy')  && (data.role !=='gym')" dark
                :color="hasActiveSub ? '#ffa200':''">
          {{ hasActiveSub  ? 'PRO Member':'Member' }}
        </v-chip>
        <v-chip v-if="data.role ==='doctor'" dark :color="data.doctor.online ? 'green':''">{{ data.doctor.online  ? 'Online':'Offline' }}</v-chip>
      </v-col>



      <v-spacer/>

      <v-btn v-if="data.role !== 'gym' && data.role !== 'therapy'" @click="editSheet = true" elevation="0" dark rounded color="#ffa200">
        <v-icon class="mr-2">mdi-pencil</v-icon>Edit
      </v-btn>

      <v-btn v-if="data.role === 'gym'" @click="editGymSheet = true" elevation="0" dark rounded color="#ffa200">
        <v-icon class="mr-2">mdi-pencil</v-icon>Edit
      </v-btn>

      <v-btn v-if="data.role === 'therapy'" @click="editTherapySheet = true" elevation="0" dark rounded color="#ffa200">
        <v-icon class="mr-2">mdi-pencil</v-icon>Edit
      </v-btn>

    </v-row>
    <!-- <v-bottom-sheet inset v-model="editSheet">
      <UserEditBasicData :data="data" @close="editSheet = false;$router.back()"/>
    </v-bottom-sheet>

    <v-bottom-sheet scrollable inset v-model="editGymSheet">
      <GymUserEditBasicData :gym="gym" @soft-close="editGymSheet = false;" @close="close"/>
    </v-bottom-sheet> -->

    <v-bottom-sheet scrollable inset v-model="editTherapySheet" v-if="editTherapySheet">
      <AddTherepyDialog :therapy='data' :edit="true" @soft-close="editTherapySheet = false;" @close="close"/>
    </v-bottom-sheet>
  </div>
</template>

<script>
import UserEditBasicData from "@/components/UserEditBasicData";
import GymUserEditBasicData from "@/components/GymEditBasicData";
import {authClient} from "@/plugins/http";
import AddTherepyDialog from "@/components/AddTherepyDialog.vue";

export default {
  name: "UserDetailsHeading",
  components: {GymUserEditBasicData, UserEditBasicData, AddTherepyDialog},
  data: () => ({
    editSheet: false,
    editGymSheet: false,
    editTherapySheet: false,
    image_src_1: "",
    current_file_img_1: null,
    isDataload: false
  }),
  props: {
    data: {
      type: Object,
      required: true
    },
    gym: {
      type: Object,
      required: true,
    },
    member_load: {
      type: Function,
      required: true,
    }
  },
  watch:{
    data(newValue, oldValue) {
      this.image_src_1= this.$store.state.s3BaseUrl + this.data.avatar_url
    },
  },
  methods:{
    hasActiveSub(){
      if(this.data.subscription === null){
        return false;
      } else {
        return this.data.subscription.is_active
      }
    },
    close(){
      this.member_load()
      this.editTherapySheet = false;
      this.$emit('close');
    },
    imgUpload(type = 1) {
          this.$refs.imageUploadFeild_1.click();
      },
      viewImage(event,type = 1) {
        if (event) {
            this.image_src_1 = URL.createObjectURL(event.target.files[0]);
            this.current_file_img_1 = event.target.files[0]
            this.submitForm()
        }
        
      },
      submitForm(){
          this.loading = true;
          let formData = new FormData();
          formData.append('file', this.current_file_img_1);

          authClient.post('/users/file-uploads/avatar',formData)
          .then((response) => {
              this.loading = false;
              // this.loadData()
              let response_data = response.status
              if(response_data){
                this.$toast.success({
                  title: 'Ok',
                  message: 'success',
              });
              }else{
                this.loading = false;
                this.$toast.error({
                  title: 'error',
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
      },
  },
  mounted() {
    if(this.isDataload){
      this.image_src_1= this.$store.state.s3BaseUrl + this.data.avatar_url
    }
    // setTimeout(() => {
    // 
    // }, 1500);
  }
}
</script>

<style scoped>
  .img-properties {
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
    }
    .dp_change{
      background-color: #BBDEFB;
      border-radius: 10px;
    }

    .upload-lable{
      position: absolute;
      top: 1.5rem; /* You can adjust the top margin as needed */
      margin-left: 0.5rem; /* You can adjust the left margin as needed */
      z-index: 1;
    }

    .err-msg{
      color: red;
    }
</style>
