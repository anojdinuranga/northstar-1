<template>
    <v-container>
      <v-row no-gutters>
        <v-text-field v-model="search" outlined rounded label="Search Thrapies..."></v-text-field>
        <v-btn @click="addUserDialog = true; editTherapy = null; isEdit = false" class="ml-2" rounded height="56" elevation="0" dark>
          <v-icon>mdi-plus</v-icon>
          Add User
        </v-btn>
      </v-row>
  
      <v-card outlined :loading="loading">
        <v-data-table
            :search="search"
            :headers="headers"
            :items="therapies">
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" @click="editUserDetails(item)" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="red"  @click="showDeleteConfirmation(item, deleteTherapy)" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
  
          <template v-slot:item.working_type="{ item }">
            {{ item.working_type == '1' ? 'Full Time' : 'Specific Time' }}
          </template>

          <template v-slot:item.paying_type="{ item }">
            {{ item.paying_type == '1' ? 'Per Hour' : 'Per Session' }}
          </template>
        </v-data-table>
      </v-card>
  
  
      <v-dialog max-width="768" persistent v-if="addUserDialog" v-model="addUserDialog">
        <AddTherepyDialog :therapy='editTherapy' :edit="isEdit" @close="closeDialogs"/>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import {authClient} from "@/plugins/http";
  import AddTherepyDialog from "@/components/AddTherepyDialog.vue";
  
  export default {
    name: "Add Physio Therapy",
    components: {AddTherepyDialog},
    data: () => ({
      search: '',
      loading: true,
      therapies: [],
      headers: [
        {text: "User ID", value: "user_id"},
        {text: "Name", value: "name"},
        {text: "Email", value: "email"},
        {text: "Phone", value: 'phone'},
        {text: "Paying Type", value: 'paying_type'},
        {text: "Working Type", value: 'working_type'},
        {text: "Actions", value: "actions", sortable: false}
      ],
      addUserDialog: false,
      editTherapy: null,
      isEdit: false
    }),
    methods: {
      editUserDetails(user) {
        this.editTherapy = user;
        this.isEdit = true;
        this.addUserDialog = true;
      },
      closeDialogs(){
        this.getTherapies();
        this.addUserDialog = false;
        this.editTherapy = null;
        this.isEdit = false;
      },
      getTherapies() {
        authClient.get('/therapy/list').then((response) => {
          let data = response.data[0]
          if(data.status){
            this.therapies = data.data.result;
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
      deleteTherapy(item) {
          authClient.post('/therapy/delete',{
            userId: item.user_id,
            therapy_id: item.therapy_Id
          }).then((response) => {
            let data = response.data[0]
            if(data.status){
              this.$toast.success({
                title: 'Ok',
                message: data.message,
              });
              this.getTherapies()
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
    },
    mounted() {
      this.getTherapies();
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  